# Sui Explorer
A chain explorer for the Sui network, similiar in functionality to [Etherscan](https://etherscan.io/) or [Solana Explorer](https://explorer.solana.com/).

## Data Source / RPC URL
The explorer front-end can use any Sui RPC url as a backend, but it must have CORS setup. 

To change the RPC url, pass a [url-encoded](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding) URL to the rpc parameter:

to use http://127.0.0.1:5000 (the REST api's default local port):

[http://127.0.0.1:3000?rpc=http%3A%2F%2F127.0.0.1%3A5000%2F](http://127.0.0.1:3000?rpc=http%3A%2F%2F127.0.0.1%3A5000%2F)

it defaults to https://demo-rpc.sui.io (for now).

The rpc url preference will be remembered for 3 hours before being discarded - this way, it's not necessary to continually pass it on every page.

If the explorer is served over HTTPS, the rpc also needs to be HTTPS (proxied from HTTP).


## Running Locally

This is how you can run with a local REST server and local copy of the explorer.

Make sure you are on a branch of the repo that supports this - `explorer-rest` at time of writing, others soon.

### Getting started

You need [Rust](https://www.rust-lang.org/tools/install) & [Node.js](https://nodejs.org/en/download/) installed for this.

from the root of the repo:

```bash
cargo build --release          # build the network and rest server
./target/release/rest_server        # run the rest server - defaults to port 5000

# in another terminal tab, from the repo root:
cd explorer/client       
npm install              # install client deps
npm start                # start the development server for the client  
```

If everything worked, you should be able to view your local explorer at [127.0.0.1:3000?rpc=http%3A%2F%2F127.0.0.1%3A5000%2F](http://127.0.0.1:3000?rpc=http%3A%2F%2F127.0.0.1%3A5000%2F)

### CORS issues / USE FIREFOX LOCALLY

Due to current technical issues, the rest api doesn't have CORS headers setup, and must be proxied to add them. The demo server has this.

Chrome doesn't let you make requests without CORS on the local host, but **Firefox does**, so it is **strongly recommended to use Firefox for local testing**.

## ----------------------------------------------------------------------
## no more about running locally
## ----------------------------------------------------------------------

## Proposed Basic Architecture

This is described in order of how data flows, from the source network to the end usder.

* We get raw data from the network using the in-progress "bulk sync" API

    This raw data is dumped into a document store / noSQL kind of DB (which one not decided yet).

    Plenty of the Cosmos explorers use this step, citing how much easier it makes syncing history & recovering from periods of being offline. Access to untouched historical data means that any errors in converting the data into relational table form can be corrected later.

* A sync process runs to move new data from this raw cache into a more structured, relational database. 

    This DB is PostgreSQL, unless there's a strong argument for using something else presented. 

    We index this database to optimize common queries - "all transactions for an address", "objects owned by address", etc. 

* The HTTP api is implemented as a Rust webserver, talks to the relational database & encodes query results as JSON

* Browser frontend is a standard React app, powered by the HTTP api


## Sub-Projects

Front-end code goes in `client` folder,

All back-end pieces (historical data store, relational DB, & HTTP layer) go in `server` sub-folders.
