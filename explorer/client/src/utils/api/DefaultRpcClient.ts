// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from 'sui.js';

import { getEndpoint } from './rpcSetting';

export const DefaultRpcClient = new JsonRpcProvider(getEndpoint());
