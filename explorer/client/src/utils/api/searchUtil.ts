// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { isObjectNotExistsInfo, isObjectRef } from 'sui.js';

import { DefaultRpcClient as rpc } from './DefaultRpcClient';

export const navigateWithUnknown = async (
    input: string,
    navigate: Function
) => {
    const addrPromise = rpc.getOwnedObjectRefs(input).then((data) => {
        if (data.length <= 0) throw new Error('No objects for Address');

        return {
            category: 'addresses',
            data: data,
        };
    });
    const objInfoPromise = rpc.getObjectInfo(input).then((data) => {
        const deets = data.details;
        if (isObjectNotExistsInfo(deets) && !isObjectRef(deets)) {
            throw new Error('no object found');
        }

        return {
            category: 'objects',
            data: data,
        };
    });

    const txDetailsPromise = rpc.getTransaction(input).then((data) => ({
        category: 'transactions',
        data: data,
    }));

    return Promise.allSettled([
        objInfoPromise,
        txDetailsPromise,
        addrPromise,
    ]).then((results) => {
        if (results.every((result) => result.status !== 'fulfilled')) {
            navigate(`../missing/${encodeURIComponent(input)}`);
        } else {
            const result = results.find(
                (result) => result.status === 'fulfilled'
            ) as PromiseFulfilledResult<{ category: string; data: object }>;

            navigate(
                `../${result.value?.category}/${encodeURIComponent(input)}`,
                {
                    state: result.value?.data,
                }
            );
        }
    });
};
