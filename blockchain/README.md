# Blockchain (Avalanche Fuji) - Current Implementation

This module integrates the Pong project with a Solidity smart contract deployed on **Avalanche Fuji Testnet**.

It is focused on storing tournament verification data on-chain in a test environment.

## What Is Implemented

- **Blockchain network**: Avalanche Fuji Testnet (Chain ID `43113`)
- **Smart contract**: `contracts/Pong.sol`
- **Deployment flow**: Hardhat deployment script writes contract metadata for frontend usage
- **Frontend wallet integration**: MetaMask connection and Fuji network switch
- **On-chain tournament write flow from UI**:
  1. Create tournament
  2. Add participant (connected wallet)
  3. Record score (`1`, minimal value for verification)
  4. Declare winner (connected wallet)
- **On-chain read flow from UI**:
  - Fetch recent tournaments and show `Tournament ID | Winner | Status`

## Why 4 Transactions Are Used

The current contract API splits tournament lifecycle into separate state-changing functions:

1. `createTournament(...)`
2. `addParticipants(...)`
3. `recordScore(...)`
4. `declareWinner(...)`

Each of these writes to blockchain storage, so each requires its own transaction on Avalanche C-Chain.
This is why one tournament save produces 4 transactions.

## Folder Overview

```text
blockchain/
├── contracts/
│   └── Pong.sol
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── hardhat.config.js
├── package.json
└── README.md
```

## Contract Summary

`Pong.sol` includes:

- `createTournament(string name)`
- `addParticipants(uint256 tournamentId, address player)`
- `recordScore(uint256 tournamentId, address player, uint256 score)`
- `declareWinner(uint256 tournamentId, address winner)`
- `getTournament(uint256 tournamentId)`
- `getScore(uint256 tournamentId, address player)`
- `getParticipants(uint256 tournamentId)`

### Network

- Network: Avalanche Fuji Testnet
- RPC: `https://api.avax-test.network/ext/bc/C/rpc`
- Chain ID: `43113` (`0xA869`)
- Explorer: [https://testnet.snowtrace.io/](https://testnet.snowtrace.io/)

### Environment Variables

Hardhat currently loads env vars from:

- `../docker/.env` (relative to `blockchain/hardhat.config.js`)

Required values:

- `FUJI_RPC_URL`
- `PRIVATE_KEY`

Deployment script outputs contract metadata to:

- `public/scripts/js/contract/pong.json`
- `frontend/scripts/js/contract/pong.json`

## Frontend Integration Files

- `frontend/scripts/wallet-connect.ts`
- `frontend/scripts/contract-service.ts`
- `frontend/scripts/game-ready-page.ts`
- `frontend/scripts/winner-page.ts`

## Notes

- This implementation is **testnet-only**.
- Do not use mainnet private keys.
- Keep private keys and secrets out of version control.
