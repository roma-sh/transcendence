import { tSettings } from "./pong.js";

export function handleGoBackGameReadyPage() {
  location.hash = '#tournament-page-player-aliases';
}

export function initGameReadyPage() {

  if (tSettings.playerAliases.length == 0) {
    if (tSettings.winnersAliases.length == 1) {
      tSettings.playerAliases = [];
      tSettings.secondPlaceAlias = tSettings.secondPlaceAliases.pop()!;
      tSettings.firstPlaceAlias = tSettings.winnersAliases.pop()!;
      tSettings.winnersAliases = [];
      tSettings.secondPlaceAliases = [];
      location.hash = `#winner-page`;
      return;
    }

    tSettings.playerAliases = tSettings.winnersAliases.slice(); // Copy winners to the next round
    tSettings.winnersAliases = []; // Clear winners for the next round
  }

  // 1. Extract the First Player (Start of the list)
  // shift() removes and returns the first element.
  const p1Name = tSettings.playerAliases.shift(); 

  // 2. Extract the Last Player (End of the list)
  // pop() removes and returns the last element.
  const p2Name = tSettings.playerAliases.pop();

  if (p1Name && p2Name)
    tSettings.currentMatch = { p1Name, p2Name };
  else
    tSettings.currentMatch = null;

  // 3. Inject Names into the DOM
  const p1NameEl = document.querySelector('.js-p1-name');
  const p2NameEl = document.querySelector('.js-p2-name');

  if (p1NameEl) {
    p1NameEl.textContent = p1Name || '';
  }
  if (p2NameEl) {
    p2NameEl.textContent = p2Name || '';
  }
}

export function handleStartTournament() {

  if (!tSettings.currentMatch) {
    console.error('Missing player names for game start');
    return;
  }

  location.hash = '#game-page';
}
