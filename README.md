## On-Going Referenda & Runtime Upgrade Checker
This script queries two APIs:
1. Sidecar from where it fetches the on-going referenda from the `on-going-referenda` endpoint.
2. Polkassembly from where it retrieves the corresponding titles for these referenda.

The script then checks if any of the titles include the word `upgrade`. If so, it highlights them with an additional attention message.

### Prerequisites
- `Node.js`: Ensure you have Node.js installed.
- Axios: install axios by running `npm install axios`.
- Sidecar instance: Have a sidecar instance running locally (in a separate terminal).
  - The sidecar instance should be connected to the chain you would like to check the referendas.

### How to run
- Run the script with the command  `node main.js`.
- Optional argument: the block height at which to check the on-going referenda, e.g. `node main.js {BLOCK}`.

### Example
- Spin up a Sidecar instance connected to the Kusama chain with the command `NODE_ENV=kusama yarn start` 
  - `.env.kusama` : `SAS_SUBSTRATE_URL=wss://kusama-rpc.polkadot.io`
- In another terminal run this command 
  ```
  node main.js 21652724
  ```
- The output you should see is the following ![referenda](/media/referenda.png).