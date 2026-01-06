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

  // Save to pong.json
  const jsonPath = path.join(__dirname, '../../public/scripts/js/contract/pong.json');
  const jsonDir = path.dirname(jsonPath);
  
  // Ensure directory exists
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  
  fs.writeFileSync(jsonPath, JSON.stringify(contractMeta, null, 2));
  console.log('Contract metadata saved to:', jsonPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



