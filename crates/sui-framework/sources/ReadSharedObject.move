// Copyright (c) 2022, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// A ReadSharedObject is a shared object that can be read by everyone, but can only
/// be mutated by the address that created this object.
/// To use it, define a data type that would hold all the data you want in your
/// object in `T`, and call `ReadSharedObject::create<T>` to create this object.
module Sui::ReadSharedObject {
    use Sui::ID::VersionedID;
    use Sui::Transfer;
    use Sui::TxContext::TxContext;
    use Sui::TxContext;

    struct ReadSharedObject<T: store> has key {
        id: VersionedID,
        mutator: address,
        data: T,
    }

    public fun create<T: store>(data: T, ctx: &mut TxContext) {
        let object = ReadSharedObject {
            id: TxContext::new_id(ctx),
            mutator: TxContext::sender(ctx),
            data,
        };
        Transfer::share_object(object);
    }

    public fun borrow<T: store>(self: &ReadSharedObject<T>): &T {
        &self.data
    }

    public fun borrow_mut<T: store>(
        self: &mut ReadSharedObject<T>,
        ctx: &TxContext,
    ): &mut T {
        assert!(self.mutator == TxContext::sender(ctx), 0);
        return &mut self.data
    }
}
