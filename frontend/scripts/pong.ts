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
    game();
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