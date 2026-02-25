const hre = require('hardhat');
const path = require('path');
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const Pong = await hre.ethers.getContractFactory('Pong');
  const pong = await Pong.deploy();
  await pong.waitForDeployment();

  const contractAddress = await pong.getAddress();
  console.log('Pong deployed to:', contractAddress);

  // Load the contract artifact to get the ABI
  const contractArtifact = await hre.artifacts.readArtifact('Pong');
  
  // Create the metadata object
  const contractMeta = {
    address: contractAddress,
    abi: contractArtifact.abi
  };

  // Save to pong.json (CLI / backend usage)
  const jsonPath = path.join(__dirname, '../../public/scripts/js/contract/pong.json');
  const jsonDir = path.dirname(jsonPath);

  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  fs.writeFileSync(jsonPath, JSON.stringify(contractMeta, null, 2));
  console.log('Contract metadata saved to:', jsonPath);

  // Also save a copy into the frontend build folder so the SPA can fetch it
  const feJsonPath = path.join(__dirname, '../../frontend/scripts/js/contract/pong.json');
  const feJsonDir = path.dirname(feJsonPath);

  if (!fs.existsSync(feJsonDir)) {
    fs.mkdirSync(feJsonDir, { recursive: true });
  }
  fs.writeFileSync(feJsonPath, JSON.stringify(contractMeta, null, 2));
  console.log('Frontend contract metadata saved to:', feJsonPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



