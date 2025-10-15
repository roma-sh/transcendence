const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const Pong = await hre.ethers.getContractFactory('Pong');
  const pong = await Pong.deploy();
  await pong.deployed();

  console.log('Pong deployed to:', pong.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


