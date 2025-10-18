const hre = require('hardhat');
const path = require('path');
const fs = require('fs');

function loadContractMeta() {
  const jsonPath = path.join(__dirname, '../../public/scripts/js/contract/pong.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed.address || !parsed.abi) {
    throw new Error('Invalid pong.json: missing address or abi');
  }
  return parsed;
}

async function getContract() {
  const { address, abi } = loadContractMeta();
  const signer = (await hre.ethers.getSigners())[0];
  return new hre.ethers.Contract(address, abi, signer);
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd) {
    console.log('Usage: hardhat run --network fuji scripts/interact.js <cmd> [...args]');
    console.log('Commands:');
    console.log('  createTournament <name>');
    console.log('  addParticipants <tournamentId> <playerAddress>');
    console.log('  recordScore <tournamentId> <playerAddress> <score>');
    console.log('  getScore <tournamentId> <playerAddress>');
    console.log('  getTournament <tournamentId>');
    console.log('  declareWinner <tournamentId> <winnerAddress>');
    process.exit(1);
  }

  const c = await getContract();

  switch (cmd) {
    case 'createTournament': {
      const name = args[0] || 'Pong Cup';
      const tx = await c.createTournament(name);
      const receipt = await tx.wait();
      const count = await c.tournamentCount();
      console.log('Created. tournamentCount =', count.toString());
      console.log('Tx hash:', receipt.hash);
      break;
    }
    case 'addParticipants': {
      const id = args[0];
      const player = args[1];
      const tx = await c.addParticipants(id, player);
      const receipt = await tx.wait();
      console.log('Participant added. Tx:', receipt.transactionHash);
      break;
    }
    case 'recordScore': {
      const id = args[0];
      const player = args[1];
      const score = args[2];
      const tx = await c.recordScore(id, player, score);
      const receipt = await tx.wait();
      console.log('Score recorded. Tx:', receipt.transactionHash);
      break;
    }
    case 'getScore': {
      const id = args[0];
      const player = args[1];
      const score = await c.getScore(id, player);
      console.log('Score =', score.toString());
      break;
    }
    case 'getTournament': {
      const id = args[0];
      const t = await c.getTournament(id);
      console.log({
        name: t.name,
        timestamp: t.timestamp.toString(),
        creator: t.creator,
        winner: t.winner,
        finalized: t.finalized,
        participantsCount: t.participantsCount.toString(),
      });
      const parts = await c.getParticipants(id);
      console.log('Participants:', parts);
      break;
    }
    case 'declareWinner': {
      const id = args[0];
      const winner = args[1];
      const tx = await c.declareWinner(id, winner);
      const receipt = await tx.wait();
      console.log('Finalized. Tx:', receipt.transactionHash);
      break;
    }
    default:
      throw new Error('Unknown cmd: ' + cmd);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});



