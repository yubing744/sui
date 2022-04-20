// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

use std::collections::BTreeMap;
use std::fmt::{Display, Formatter};
use std::fmt::Write;
use std::path::PathBuf;
use std::time::Duration;

use serde::Deserialize;
use serde::Serialize;

use sui_network::network::NetworkClient;
use sui_network::transport;
use sui_types::base_types::{AuthorityName, SuiAddress};
use sui_types::signature_seed::SignatureSeed;

use async_trait::async_trait;
use crate::config::Config;
use crate::rpc_signer_client::RpcSignerClient;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum DeterministicSignerType {
    Embedded(DeterministicSignerConfig),
    RPC(String),
}

impl Display for DeterministicSignerType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let mut writer = String::new();

        match self {
            DeterministicSignerType::Embedded(config) => {
                writeln!(writer, "Deterministic Signer Type : Embedded")?;
                // We don't print the seed for security reasons.
            }
            DeterministicSignerType::RPC(url) => {
                writeln!(writer, "Deterministic Signer Type : JSON-RPC")?;
                writeln!(writer, "Gateway URL : {}", url)?;
            }
        }
        write!(f, "{}", writer)
    }
}

impl DeterministicSignerType {
    pub fn init(&self) -> Result<RpcSignerClient, anyhow::Error> {
        Ok(match self {
            DeterministicSignerType::Embedded(config) => {
                Box::new(SignerState::new(path, committee, authority_clients)?)
            }
            DeterministicSignerType::RPC(url) => Box::new(RpcSignerClient::new(url.clone())?),
        })
    }
}

#[derive(Serialize, Deserialize)]
pub struct DeterministicSignerConfig {
    pub(crate) seed: SignatureSeed,
}

impl Config for DeterministicSignerConfig {}

impl Default for DeterministicSignerConfig {
    fn default() -> Self {
        Self {
            seed: SignatureSeed::default(),
        }
    }
}

// Operations are considered successful when they successfully reach a quorum of authorities.
#[async_trait]
pub trait DeterministicSignerAPI {
    async fn get_account(&self, identifier: &str) -> Result<SuiAddress, anyhow::Error>;
    async fn sign_data(&self, identifier: &str, data: &[u8]) -> Result<Vec<u8>, anyhow::Error>;
}
