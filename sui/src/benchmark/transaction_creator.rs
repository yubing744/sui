// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#![deny(warnings)]

use bytes::Bytes;
use move_core_types::account_address::AccountAddress;
use move_core_types::ident_str;
use rayon::prelude::*;
use sui_adapter::genesis;
use sui_core::authority::*;
use sui_types::crypto::{get_key_pair, AuthoritySignature, KeyPair, PublicKeyBytes, Signature};
use sui_types::SUI_FRAMEWORK_ADDRESS;
use sui_types::{base_types::*, committee::*, messages::*, object::Object, serialize::*};
use tokio::runtime::Runtime;

use tracing::info;

use rocksdb::Options;
use std::env;
use std::fs;
use std::path::Path;
use std::sync::Arc;

use crate::config::{PersistedConfig, GenesisConfig};

const OBJECT_ID_OFFSET: &str = "0x10000";
const GAS_PER_TX: u64 = 10000000;

/// Create a transaction for object transfer
/// This can either use the Move path or the native path
fn make_transfer_transaction(
    object_ref: ObjectRef,
    recipient: SuiAddress,
    use_move: bool,
) -> SingleTransactionKind {
    if use_move {
        let framework_obj_ref = (
            ObjectID::from(SUI_FRAMEWORK_ADDRESS),
            SequenceNumber::new(),
            ObjectDigest::new([0; 32]),
        );

        SingleTransactionKind::Call(MoveCall {
            package: framework_obj_ref,
            module: ident_str!("SUI").to_owned(),
            function: ident_str!("transfer").to_owned(),
            type_arguments: Vec::new(),
            object_arguments: vec![object_ref],
            shared_object_arguments: vec![],
            pure_arguments: vec![bcs::to_bytes(&AccountAddress::from(recipient)).unwrap()],
        })
    } else {
        SingleTransactionKind::Transfer(Transfer {
            recipient,
            object_ref,
        })
    }
}

/// Creates an object for use in the microbench
fn create_gas_object(object_id: ObjectID, owner: SuiAddress) -> Object {
    Object::with_id_owner_gas_coin_object_for_testing(
        object_id,
        SequenceNumber::new(),
        owner,
        GAS_PER_TX,
    )
}

/// This builds, signs a cert and serializes it
fn make_serialized_cert(
    keys: &[(PublicKeyBytes, KeyPair)],
    committee: &Committee,
    tx: Transaction,
) -> Vec<u8> {
    // Make certificate
    let mut certificate = CertifiedTransaction::new(tx);
    for i in 0..committee.quorum_threshold() {
        let (pubx, secx) = keys.get(i).unwrap();
        let sig = AuthoritySignature::new(&certificate.transaction.data, secx);
        certificate.signatures.push((*pubx, sig));
    }

    let serialized_certificate = serialize_cert(&certificate);
    assert!(!serialized_certificate.is_empty());
    serialized_certificate
}

fn make_authority_state(
    store_path: &Path,
    db_cpus: i32,
    committee: &Committee,
    pubx: &PublicKeyBytes,
    secx: KeyPair,
) -> (AuthorityState, Arc<AuthorityStore>) {
    fs::create_dir(&store_path).unwrap();
    info!("Open database on path: {:?}", store_path.as_os_str());

    let mut opts = Options::default();
    opts.increase_parallelism(db_cpus);
    opts.set_write_buffer_size(256 * 1024 * 1024);
    opts.enable_statistics();
    opts.set_stats_dump_period_sec(5);
    opts.set_enable_pipelined_write(true);

    // NOTE: turn off the WAL, but is not guaranteed to
    // recover from a crash. Keep turned off to max safety,
    // but keep as an option if we periodically flush WAL
    // manually.
    // opts.set_manual_wal_flush(true);

    let store = Arc::new(AuthorityStore::open(store_path, Some(opts)));
    (
        Runtime::new().unwrap().block_on(async {
            AuthorityState::new(
                committee.clone(),
                *pubx,
                Arc::pin(secx),
                store.clone(),
                genesis::clone_genesis_compiled_modules(),
                &mut genesis::get_genesis_context(),
            )
            .await
        }),
        store,
    )
}

fn make_gas_objects(
    address: SuiAddress,
    tx_count: usize,
    batch_size: usize,
    obj_id_offset: ObjectID,
) -> (Vec<(Vec<Object>, Object)>, ObjectID) {
    let total_count = tx_count * batch_size;
    let mut objects = vec![];
    let mut gas_objects = vec![];
    // Objects to be transferred
    ObjectID::in_range(obj_id_offset, total_count as u64)
        .unwrap()
        .iter()
        .for_each(|q| objects.push(create_gas_object(*q, address)));

    // Objects for payment
    let next_offset = objects[objects.len() - 1].id();

    ObjectID::in_range(next_offset.next_increment().unwrap(), tx_count as u64)
        .unwrap()
        .iter()
        .for_each(|q| gas_objects.push(create_gas_object(*q, address)));

    let last_offset = gas_objects[gas_objects.len() - 1].id();

    (
        objects[..]
            .chunks(batch_size)
            .into_iter()
            .map(|q| q.to_vec())
            .zip(gas_objects.into_iter())
            .collect::<Vec<_>>(),
        last_offset,
    )
    // (0..tx_count)
    //     .into_par_iter()
    //     .map(|x| {
    //         let mut objects = vec![];
    //         ObjectID::in_range(obj_id_offset, batch_size as u64)
    //             .unwrap()
    //             .iter()
    //             .for_each(|q| objects.push(create_object(*q, address, use_move)));

    //         let mut gas_object_id = [0; 20];
    //         gas_object_id[8..16].clone_from_slice(&(obj_id_offset + x).to_be_bytes()[..8]);
    //         let gas_object = Object::with_id_owner_gas_coin_object_for_testing(
    //             ObjectID::from(gas_object_id),
    //             SequenceNumber::new(),
    //             address,
    //             2000000,
    //         );
    //         assert!(gas_object.version() == SequenceNumber::from(0));

    //         (objects, gas_object)
    //     })
    //     .collect()
}

fn make_serialized_transactions(
    address: SuiAddress,
    keypair: KeyPair,
    committee: &Committee,
    account_gas_objects: &[(Vec<Object>, Object)],
    keys: &[(PublicKeyBytes, KeyPair)],
    batch_size: usize,
    use_move: bool,
) -> Vec<Bytes> {
    // Make one transaction per account
    // Depending on benchmark_type, this could be the Order and/or Confirmation.
    account_gas_objects
        .par_iter()
        .map(|(objects, gas_obj)| {
            let next_recipient: SuiAddress = get_key_pair().0;
            let mut single_kinds = vec![];
            for object in objects {
                single_kinds.push(make_transfer_transaction(
                    object.compute_object_reference(),
                    next_recipient,
                    use_move,
                ));
            }
            let gas_object_ref = gas_obj.compute_object_reference();
            let data = if batch_size == 1 {
                TransactionData::new(
                    TransactionKind::Single(single_kinds.into_iter().next().unwrap()),
                    address,
                    gas_object_ref,
                    5000,
                )
            } else {
                assert!(single_kinds.len() == batch_size, "Inconsistent batch size");
                TransactionData::new(
                    TransactionKind::Batch(single_kinds),
                    address,
                    gas_object_ref,
                    5000,
                )
            };

            let signature = Signature::new(&data, &keypair);
            let transaction = Transaction::new(data, signature);

            // Serialize transaction
            let serialized_transaction = serialize_transaction(&transaction);

            assert!(!serialized_transaction.is_empty());

            vec![
                serialized_transaction.into(),
                make_serialized_cert(keys, committee, transaction).into(),
            ]
        })
        .flatten()
        .collect()
}

fn make_transactions(
    chunk_size: usize,
    num_chunks: usize,
    conn: usize,
    use_move: bool,
    object_id_offset: ObjectID,
    auth_keys: &[(PublicKeyBytes, KeyPair)],
    committee: &Committee,
    sender: Option<&KeyPair>,
) -> (Vec<Bytes>, Vec<Object>, ObjectID) {
    let (address, keypair) = if let Some(a) = sender {
        (SuiAddress::from(a.public_key_bytes()), a.copy())
    } else {
        get_key_pair()
    };
    println!("{}  {:?}", address, keypair);
    assert_eq!(chunk_size % conn, 0);
    let batch_size_per_conn = chunk_size / conn;

    // The batch-adjusted number of transactions
    let batch_tx_count = num_chunks * conn;
    // Only need one gas object per batch
    let (account_gas_objects, last_offset) = make_gas_objects(
        address,
        batch_tx_count,
        batch_size_per_conn,
        object_id_offset,
    );

    // Bulk load objects
    let all_objects: Vec<_> = account_gas_objects
        .clone()
        .into_iter()
        .flat_map(|(objects, gas)| objects.into_iter().chain(std::iter::once(gas)))
        .collect();

    let serialized_txes = make_serialized_transactions(
        address,
        keypair,
        committee,
        &account_gas_objects,
        auth_keys,
        batch_size_per_conn,
        use_move,
    );

    (serialized_txes, all_objects, last_offset)
}

pub struct TransactionCreator {
    pub authority_keys: Vec<(PublicKeyBytes, KeyPair)>,
    pub committee: Committee,

    pub authority_state: AuthorityState,
    pub object_id_offset: ObjectID,
    pub authority_store: Arc<AuthorityStore>,
}

impl TransactionCreator {
    pub fn new(_committee_size: usize, db_cpus: usize) -> Self {
        let gen_cfg: GenesisConfig = PersistedConfig::read(Path::new("gen.json")).unwrap();



        let mut keys = Vec::new();


        for q in gen_cfg.authorities {
            let key_pair = q.key_pair;
            let name = *key_pair.public_key_bytes();
            keys.push((name, key_pair));
        }
        // for _ in 0..committee_size {
        //     let (_, key_pair) = get_key_pair();
        //     let name = *key_pair.public_key_bytes();
        //     keys.push((name, key_pair));
        // }
        let committee = Committee::new(keys.iter().map(|(k, _)| (*k, 1)).collect());

        // Pick an authority and create state.
        let (public_auth0, secret_auth0) = keys.pop().unwrap();

        // Create a random directory to store the DB
        let path = env::temp_dir().join(format!("DB_{:?}", ObjectID::random()));
        let auth_state = make_authority_state(
            &path,
            db_cpus as i32,
            &committee,
            &public_auth0,
            secret_auth0,
        );
        Self {
            committee,
            authority_state: auth_state.0,
            authority_store: auth_state.1,
            authority_keys: keys,
            object_id_offset: ObjectID::from_hex_literal(OBJECT_ID_OFFSET).unwrap(),
        }
    }

    pub fn generate_transactions(
        &mut self,
        tcp_conns: usize,
        use_move: bool,
        chunk_size: usize,
        num_chunks: usize,
        sender: Option<&KeyPair>,
    ) -> Vec<Bytes> {
        let (load_gen_txes, objects, last_offset) = make_transactions(
            chunk_size,
            num_chunks,
            tcp_conns,
            use_move,
            self.object_id_offset,
            &self.authority_keys,
            &self.committee,
            sender,
        );

        self.object_id_offset = last_offset.next_increment().unwrap();

        // Insert the objects
        self.authority_store
            .bulk_object_insert(&objects[..].iter().collect::<Vec<&Object>>())
            .unwrap();

        load_gen_txes
    }
}
