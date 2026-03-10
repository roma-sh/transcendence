import { tSettings } from "./pong.js";
import { contractService } from "./contract-service.js";

export function handleGoBackGameReadyPage() {
  location.hash = '#tournament-page-player-aliases';
}

export function handleStartTournament() {

  if (!tSettings.currentMatch) {
    return;
  }

  location.hash = '#game-page';
}

export function initGameReadyPage() {
  console.log("--- Initializing Game Ready Page ---");
  console.log("Current Aliases in queue:", [...tSettings.playerAliases]);
  console.log("Current Winners list:", [...tSettings.winnersAliases]);
  console.log("Number of players for this round context:", tSettings.numberOfPlayers);

  if (tSettings.playerAliases.length === 0) {
    console.log("⚠️ Player queue is empty. Checking for tournament progression...");
    
    if (tSettings.winnersAliases.length === 1 && tSettings.numberOfPlayers === 2) {
      console.log("🏆 Final match winner detected! Preparing winner-page.");
      
      tSettings.firstPlaceAlias = tSettings.winnersAliases.pop()!;
      tSettings.secondPlaceAlias = tSettings.secondPlaceAliases.pop() || "";
      
      console.log(`Results: 1st place: ${tSettings.firstPlaceAlias}, 2nd place: ${tSettings.secondPlaceAlias}`);
      void contractService.recordTournamentWinner("Pong Tournament", tSettings.firstPlaceAlias);

      tSettings.playerAliases = [];
      tSettings.winnersAliases = [];
      tSettings.secondPlaceAliases = [];
      
      location.hash = `#winner-page`;
      return;
    }

    const expectedWinners = tSettings.numberOfPlayers / 2;

    if (tSettings.winnersAliases.length === expectedWinners) {
      console.log(`🔄 Round complete. Moving all ${tSettings.winnersAliases.length} winners to the next round.`);
      
      tSettings.playerAliases = [...tSettings.winnersAliases]; 
      tSettings.numberOfPlayers = tSettings.playerAliases.length; 
      tSettings.winnersAliases = []; 
      
      initGameReadyPage();
      return;
    } else {
      console.log(`⏳ Waiting for all matches to finish. (Winners: ${tSettings.winnersAliases.length}/${expectedWinners})`);
      return; 
    }
  }

  const p1Name = tSettings.playerAliases.shift(); 
  const p2Name = tSettings.playerAliases.pop();

  console.log(`⚔️ Match Setup: ${p1Name} VS ${p2Name}`);

  if (p1Name && p2Name) {
    tSettings.currentMatch = { p1Name, p2Name };
    console.log("Match object stored in tSettings:", tSettings.currentMatch);
  } else {
    tSettings.currentMatch = null;
  }

  const p1NameEl = document.querySelector('.js-p1-name');
  const p2NameEl = document.querySelector('.js-p2-name');

  if (p1NameEl) {
    p1NameEl.textContent = p1Name || '';
    console.log("P1 DOM updated with:", p1Name);
  }
  if (p2NameEl) {
    p2NameEl.textContent = p2Name || '';
    console.log("P2 DOM updated with:", p2Name);
  }
}