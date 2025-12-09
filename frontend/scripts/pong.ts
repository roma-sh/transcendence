import {
  setInitHash,
  initWelcomePage
} from './welcome-page.js';
import { addAliasesSection } from './tournament-player-aliases.js';
import { TournamentSettings } from './types.js';
import { initUserProfilePage } from './user-profile.js';
import { initGameReadyPage } from './game-ready-page.js';
import { initWalletConnect } from './wallet-connect.js';
import { initWinnerAnnouncementPage } from './winner-page.js';
import { setupGlobalClicksDelegation } from './clicks-delegation.js';
import { game } from './game.js';
import { updateUIforUserMenu } from './user-menu.js';

export const tSettings : TournamentSettings = {
  numberOfPlayers: 1,
  numberOfBots: 0,
  playerAliases: [],
  winnersAliases: [],
  secondPlaceAliases: [],
  secondPlaceAlias: "",
  firstPlaceAlias: "",
  currentMatch: null as null | { p1Name: string; p2Name: string },
};

setupGlobalClicksDelegation();

// for the welcome page:
setInitHash();

// Initialize wallet connection - add this after the other initializations
initWalletConnect();

updateUIforUserMenu();

// Function to handle hash-based navigation
function handleHashChange() {
  const hash = location.hash;

  if (hash === '#welcome-page') {
    initWelcomePage();
  } else if (hash === '#game-page') {
    game();
  } else if (hash === '#game-ready-page') {
	  initGameReadyPage(tSettings);
  } else if (hash === '#tournament-page-player-aliases') {
    addAliasesSection();
  } else if (hash === '#user-profile') {
    initUserProfilePage();
  } else if (hash === '#winner-page') {
    initWinnerAnnouncementPage(tSettings);
  }
}

// Run on initial load
handleHashChange();

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);
