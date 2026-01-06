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

**Note**: You also need to install frontend dependencies:
```bash
cd ../frontend
npm install
```
This installs `ethers.js` which is required for frontend blockchain integration.

---

## Quick Start for New Users (After Pulling from GitHub)

**⚠️ Important**: The `public/` folder is ignored in git (contains generated files). When you first pull this repository, the `pong.json` file won't exist. You **must deploy the contract** to create it.

### Step-by-Step Setup

1. **Install Dependencies**:
   ```bash
   # Install blockchain dependencies
   cd blockchain
   npm install
   
   # Install frontend dependencies (includes ethers.js)
   cd ../frontend
   npm install
   ```

2. **Get Test AVAX Tokens**:
   - Visit [Avalanche Faucet](https://faucet.avalanche.network/)
   - Enter your wallet address
   - Request test AVAX tokens (needed for gas fees)

3. **Configure Environment**:
   Create `blockchain/.env` file:
   ```bash
   cd blockchain
   # Create .env file
   echo "FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc" > .env
   echo "PRIVATE_KEY=your_private_key_here" >> .env
   ```
   
   **⚠️ Security**: Use a test account private key, NOT your main wallet. Never commit `.env` to git.

4. **Deploy Contract** (This creates `pong.json` automatically):
   ```bash
   cd blockchain
   npm run deploy:fuji
   ```
   
   This will:
   - ✅ Deploy the contract to Avalanche Fuji Testnet
   - ✅ **Automatically create** `public/scripts/js/contract/` directory (if it doesn't exist)
   - ✅ **Automatically create** `public/scripts/js/contract/pong.json` with contract address and ABI
   - ✅ Display the deployment address and transaction hash

5. **Verify Deployment**:
   - Check that `public/scripts/js/contract/pong.json` exists
   - Verify it contains a real address (not `0x0000...`)
   - View your contract on [Snowtrace Testnet](https://testnet.snowtrace.io/)

### After Deployment

Once deployed, the frontend will automatically use the contract address from `pong.json`. The file structure will be:
```
public/
└── scripts/
    └── js/
        └── contract/
            └── pong.json  (created by deploy script, contains address + ABI)
```

**Note**: Each developer/user needs to deploy their own contract instance (or coordinate to use a shared deployed address if working in a team).

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

### Contract Not Deployed / pong.json Missing

**If `pong.json` doesn't exist or shows `0x0000...` address:**

This is normal when first pulling the repository! The `public/` folder is ignored in git.

**Solution:**
1. Ensure you've installed dependencies: `cd blockchain && npm install`
2. Create `blockchain/.env` file with `PRIVATE_KEY` and `FUJI_RPC_URL`
3. Get test AVAX from [Avalanche Faucet](https://faucet.avalanche.network/)
4. Run `npm run deploy:fuji` to deploy the contract
5. The deploy script will automatically create `public/scripts/js/contract/pong.json`

**If the file still doesn't exist after deployment:**
- Check that deployment completed successfully
- Verify the deploy script output shows "Contract metadata saved to: ..."
- Check file permissions in the `public/` directory

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

**If frontend shows "Contract not deployed" error:**
- Ensure contract is deployed: `cd blockchain && npm run deploy:fuji`
- Verify `public/scripts/js/contract/pong.json` exists and has a valid address (not `0x0000...`)
- Check that `public/` directory is accessible by the web server

**If wallet connection fails:**
- Check wallet is connected in frontend (MetaMask extension)
- Verify network is Avalanche Fuji Testnet (Chain ID: 43113)
- Check browser console for error messages

**If transactions fail:**
- Ensure you have sufficient test AVAX balance
- Verify you're on the correct network (Avalanche Fuji Testnet)
- Check that the contract address in `pong.json` matches your deployed contract

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

