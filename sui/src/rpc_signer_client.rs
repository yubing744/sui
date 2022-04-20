// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use anyhow::Error;
use async_trait::async_trait;
use jsonrpsee::http_client::{HttpClient, HttpClientBuilder};
use move_core_types::identifier::Identifier;
use move_core_types::language_storage::TypeTag;
use tokio::runtime::Handle;

use sui_core::gateway_state::{GatewayAPI, GatewayTxSeqNumber};
use sui_core::gateway_state::gateway_responses::TransactionResponse;
use sui_types::base_types::{ObjectID, ObjectRef, SuiAddress, TransactionDigest};
use sui_types::messages::{Transaction, TransactionData};
use sui_types::object::ObjectRead;

use crate::deterministic_signer_config::DeterministicSignerAPI;
use crate::rest_gateway::responses::ObjectResponse;
use crate::rpc_gateway::{
    Base64EncodedBytes, RpcGatewayClient as RpcGateway, SignedTransaction, TransactionBytes,
};

pub struct RpcSignerClient {
    client: HttpClient,
}

impl RpcSignerClient {
    pub fn new(server_url: String) -> Result<Self, anyhow::Error> {
        let client = HttpClientBuilder::default().build(&server_url)?;
        Ok(Self { client })
    }
}

#[async_trait]
impl DeterministicSignerAPI for RpcSignerClient {
    async fn get_account(&self, identifier: &str) -> Result<SuiAddress, Error> {
        // TODO add deterministic generator
    }

    async fn sign_data(&self, identifier: &str, data: &[u8]) -> Result<Vec<u8>, Error> {
        // TODO add deterministic signing
    }
}
