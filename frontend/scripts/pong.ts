import {
  setInitialWelcomePage,
  addHashForChooseModePage
} from './welcome-page.js';
import {
  initGameOptionHighlight,
  useGameOption
} from './choose-mode.js';
import { game } from './game.js';
import {
  tournament,
  addAliasesSection
} from "./tournament.js";
import { TournamentSettings } from './types.js';

import { initSignUpPage, initLogInPage } from './auth-pages.js';

import { initUserProfilePage } from './user-profile.js';

const tSettings : TournamentSettings = {
  numberOfPlayers: 1,
  playerAliases: [],
};

// for the welcome page:
setInitialWelcomePage();
addHashForChooseModePage();

// for the choose mode page:
initGameOptionHighlight();
useGameOption(tSettings);


// Function to handle hash-based navigation
function handleHashChange() {
  const hash = location.hash;

  if (hash === '#game-page') {
	if (tSettings.playerAliases && tSettings.playerAliases.length >= 2) {
		console.log("Starting game with registered players:", tSettings.playerAliases);
		
		// Καλούμε το game με τα αποθηκευμένα ονόματα
		game(tSettings.playerAliases[0], tSettings.playerAliases[1]);
		
	  } else {
		// Scenario 2: Default/Local Game (Χωρίς εγγεγραμμένους παίκτες)
		// Καλούμε το game χωρίς ορίσματα (θα χρησιμοποιήσει Player 1, Player 2)
		console.log("Starting local game with default players.");
		game(); 
	  }
    // game();
  } else if (hash === '#tournament-page') {
    tournament(tSettings);
  } else if (hash === '#tournament-page-player-aliases') {
    addAliasesSection(tSettings);
  } else if (hash === '#sign-up-page') {
    initSignUpPage();
  } else if (hash === '#log-in-page') {
    initLogInPage();
  } else if (hash === '#user-profile') {
    initUserProfilePage();
  }

}

// Run on initial load
handleHashChange();

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);