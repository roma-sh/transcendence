# Blockchain (Avalanche Integration)

This module implements blockchain-based tournament score storage using Solidity smart contracts deployed on the Avalanche Fuji Testnet. Tournament scores are securely and immutably stored on the blockchain, providing transparency and tamper-proof records.

---

## Overview

The blockchain module provides:
- **Smart Contract**: Solidity contract (`Pong.sol`) for managing tournaments and scores
- **Deployment Scripts**: Automated deployment to Avalanche Fuji Testnet
- **Interaction Scripts**: Command-line tools for testing contract functions
- **Frontend Integration**: Contract service layer for web application interaction

---

## Smart Contract

The `Pong.sol` contract manages tournament lifecycle:

- **Tournament Creation**: Create tournaments with names and timestamps
- **Participant Management**: Add participants to tournaments
- **Score Recording**: Record and update player scores
- **Tournament Finalization**: Declare winners and finalize tournaments
- **Data Retrieval**: Query tournament information, scores, and participants

### Contract Functions

- `createTournament(string name)` - Creates a new tournament, returns tournament ID
- `addParticipants(uint256 tournamentId, address player)` - Adds a participant
- `recordScore(uint256 tournamentId, address player, uint256 score)` - Records player score
- `declareWinner(uint256 tournamentId, address winner)` - Finalizes tournament with winner
- `getTournament(uint256 tournamentId)` - Returns tournament details
- `getScore(uint256 tournamentId, address player)` - Returns player's score
- `getParticipants(uint256 tournamentId)` - Returns list of participants

---

## Folder Structure

```
blockchain/
├── contracts/
│   └── Pong.sol              # Main smart contract
├── scripts/
│   ├── deploy.js             # Contract deployment script
│   └── interact.js           # Contract interaction/testing script
├── artifacts/                # Compiled contract artifacts (auto-generated)
├── cache/                    # Hardhat cache (auto-generated)
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## Setup

### Prerequisites

- Node.js and npm installed
- MetaMask or compatible Web3 wallet
- Avalanche Fuji Testnet configured in wallet
- Test AVAX tokens for gas fees (get from [Avalanche Faucet](https://faucet.avalanche.network/))

### Installation

```bash
cd blockchain
npm install
```

This installs:
- Hardhat (development environment)
- Hardhat Toolbox (testing and compilation tools)
- dotenv (environment variable management)

---

## Configuration

### 1. Environment Variables

Create a `.env` file in the `blockchain/` directory:

```bash
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key_here
```

**Important**: Never commit `.env` file to version control. Use a test account private key, not your main wallet.

### 2. Hardhat Configuration

The `hardhat.config.js` is configured for:
- **Network**: Avalanche Fuji Testnet (Chain ID: 43113)
- **Solidity Version**: 0.8.20
- **Optimizer**: Enabled (200 runs)

---

## How to Run

### Compile Contract

```bash
npm run compile
```

This compiles `Pong.sol` and generates artifacts in `artifacts/contracts/Pong.sol/`.

### Deploy Contract

```bash
npm run deploy:fuji
```

This will:
1. Deploy the contract to Avalanche Fuji Testnet
2. Save the contract address and ABI to `public/scripts/js/contract/pong.json`
3. Display the deployment address and transaction hash

**Note**: Ensure you have:
- `.env` file configured with `PRIVATE_KEY` and `FUJI_RPC_URL`
- Sufficient test AVAX in your wallet for gas fees

### Interact with Contract

After deployment, use the interaction script:

```bash
# Create a tournament
npx hardhat run --network fuji scripts/interact.js createTournament "My Tournament"

# Add a participant
npx hardhat run --network fuji scripts/interact.js addParticipants 0 0xYourAddress

# Record a score
npx hardhat run --network fuji scripts/interact.js recordScore 0 0xYourAddress 100

# Get tournament info
npx hardhat run --network fuji scripts/interact.js getTournament 0

# Get player score
npx hardhat run --network fuji scripts/interact.js getScore 0 0xYourAddress

# Declare winner
npx hardhat run --network fuji scripts/interact.js declareWinner 0 0xWinnerAddress
```

---

## Frontend Integration

The contract is integrated into the frontend through:

1. **Contract Metadata**: `public/scripts/js/contract/pong.json`
   - Contains contract address and ABI
   - Auto-updated by deployment script

2. **Contract Service**: `frontend/scripts/contract-service.ts`
   - Provides TypeScript interface for contract interaction
   - Handles wallet connection and transaction signing
   - Includes error handling and notifications

3. **Tournament Flow Integration**:
   - Tournament creation on blockchain when tournament starts
   - Participant registration
   - Score recording after each match
   - Tournament finalization when tournament ends

### Usage in Frontend

```typescript
import { contractService } from './contract-service.js';

// Create tournament
const tournamentId = await contractService.createTournament("Tournament Name");

// Add participant
await contractService.addParticipant(tournamentId, playerAddress);

// Record score
await contractService.recordScore(tournamentId, playerAddress, score);

// Finalize tournament
await contractService.declareWinner(tournamentId, winnerAddress);
```

---

## Testing Blockchain

This implementation uses **Avalanche Fuji Testnet** for development and testing:

- **Network Name**: Avalanche Fuji Testnet
- **Chain ID**: 43113 (0xA869)
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Block Explorer**: https://testnet.snowtrace.io/

### Getting Test Tokens

1. Visit [Avalanche Faucet](https://faucet.avalanche.network/)
2. Enter your wallet address
3. Request test AVAX tokens
4. Wait for confirmation (usually instant)

### Viewing Transactions

All transactions can be viewed on [Snowtrace Testnet](https://testnet.snowtrace.io/):
- Enter transaction hash or contract address
- View transaction details, gas usage, and events

---

## Important Files

- `contracts/Pong.sol` - Main smart contract source code
- `scripts/deploy.js` - Deployment script (auto-saves address to frontend)
- `scripts/interact.js` - Command-line interaction script
- `hardhat.config.js` - Hardhat configuration for Avalanche Fuji
- `public/scripts/js/contract/pong.json` - Contract metadata (address + ABI)

---

## Troubleshooting

### Contract Not Deployed

If `pong.json` shows `0x0000...` address:
- Run `npm run deploy:fuji` to deploy the contract
- Ensure `.env` file is configured correctly
- Check you have test AVAX for gas fees

### Network Errors

- Ensure MetaMask is connected to Avalanche Fuji Testnet
- Verify RPC URL in `hardhat.config.js` is correct
- Check network connectivity

### Transaction Failures

- Verify sufficient test AVAX balance
- Check contract address is correct in `pong.json`
- Ensure tournament exists before adding participants/recording scores
- Verify participant is added before recording scores

### Frontend Integration Issues

- Ensure contract is deployed and `pong.json` has valid address
- Check wallet is connected in frontend
- Verify network is Avalanche Fuji Testnet
- Check browser console for error messages

---

## Security Notes

- **Testnet Only**: This implementation uses testnet. Never use testnet private keys for mainnet.
- **Private Key Security**: Never commit `.env` file or expose private keys.
- **Gas Estimation**: Always estimate gas before transactions in production.
- **Access Control**: Contract includes access control (only creator can add participants, etc.)

---

## Development Workflow

1. **Modify Contract**: Edit `contracts/Pong.sol`
2. **Compile**: `npm run compile`
3. **Test Locally**: Use Hardhat local network (if configured)
4. **Deploy to Testnet**: `npm run deploy:fuji`
5. **Test Interactions**: Use `scripts/interact.js` to verify functionality
6. **Integrate Frontend**: Frontend automatically uses new contract address

---

## Next Steps

- Deploy contract to testnet: `npm run deploy:fuji`
- Verify deployment on Snowtrace explorer
- Test tournament creation and score recording
- Integrate with frontend tournament flow

