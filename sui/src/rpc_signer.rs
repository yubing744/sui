// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use std::ops::Deref;
use std::path::Path;

use anyhow::anyhow;
use async_trait::async_trait;
use jsonrpsee::core::RpcResult;
use jsonrpsee_proc_macros::rpc;
use move_core_types::identifier::Identifier;
use move_core_types::language_storage::TypeTag;
use serde::Deserialize;
use serde::Serialize;
use serde_with::base64::Base64;
use serde_with::serde_as;
use signature::Signature;
use tracing::debug;

use sui_core::gateway_state::{GatewayClient, GatewayState, GatewayTxSeqNumber};
use sui_core::gateway_state::gateway_responses::TransactionResponse;
use sui_types::base_types::{ObjectID, SuiAddress, TransactionDigest};
use sui_types::crypto;
use sui_types::crypto::SignableBytes;
use sui_types::messages::{Transaction, TransactionData};
use sui_types::object::ObjectRead;
use sui_types::signature_seed::SignatureSeed;

use crate::config::PersistedConfig;
use crate::deterministic_signer_config::DeterministicSignerConfig;
use crate::gateway::GatewayConfig;
use crate::rest_gateway::responses::{NamedObjectRef, ObjectResponse};

#[rpc(server, client, namespace = "deterministic-signer")]
pub trait RpcSigner {
    #[method(name = "getAccount")]
    async fn get_account(&self, identifier: &str) -> RpcResult<SuiAddress>;

    #[method(name = "signData")]
    async fn sign_data(&self, identifier: &str, data: &[u8]) -> RpcResult<Vec<u8>>;
}

/// A simple custodial deterministic signing server based on a single secret seed.
pub struct RpcSignerImpl {
    seed: SignatureSeed,
}

impl RpcSignerImpl {
    pub fn new(config_path: &Path) -> anyhow::Result<Self> {
        let config: DeterministicSignerConfig =
            PersistedConfig::read(config_path).map_err(|e| {
                anyhow!(
                    "Failed to read deterministic signer config file at {:?}: {}.",
                    config_path,
                    e
                )
            })?;
        Ok(Self { seed: config.seed })
    }
}

#[async_trait]
impl RpcSignerServer for RpcSignerImpl {
    async fn get_account(&self, identifier: &str) -> RpcResult<SuiAddress> {
        Ok(self
            .seed
            .new_deterministic_address(identifier.as_bytes(), None)
            .map_err(|e| anyhow!("{}", e))?)
    }

    async fn sign_data(&self, identifier: &str, data: &[u8]) -> RpcResult<&[u8]> {
        // TODO `data` has to be BCS signable, but what its type is?
        Ok(self
            .seed
            .sign(identifier.as_bytes(), None, data)
            .map_err(|e| anyhow!("{}", e))?
            .as_ref())
    }
}
