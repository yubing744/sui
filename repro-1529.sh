#!/bin/bash -e

cargo build --bin validator
./target/debug/validator --genesis-config-path $HOME/dev/devnet/docker/validator/genesis.conf --validator-idx 0
