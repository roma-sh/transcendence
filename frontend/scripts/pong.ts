import { setInitHash, initWelcomePage } from './welcome-page.js';
import { addAliasesSection } from './tournament-player-aliases.js';
import { TournamentSettings } from './types.js';
import { initUserProfilePage } from './user-profile.js';
import { initGameReadyPage } from './game-ready-page.js';
import { initWalletConnect } from './wallet-connect.js';
import { initWinnerAnnouncementPage } from './winner-page.js';
import { setupGlobalClicksDelegation } from './clicks-delegation.js';
import { game } from './game.js';
import { updateUIforUserMenu } from './user-menu.js';
import { initProfilePage, initAvatarUpload } from "./profile-page.js";
import { initSettingsPage } from "./settings-page.js";
import { initTermsModal } from './auth-pages.js';

export const tSettings : TournamentSettings = {
  numberOfPlayers: 2,
  numberOfBots: 0,
  playerAliases: [],
  winnersAliases: [],
  secondPlaceAliases: [],
  secondPlaceAlias: "",
  firstPlaceAlias: "",
  currentMatch: null as null | { p1Name: string; p2Name: string },
};

export function resetTournamentSettings() {
    tSettings.playerAliases = [];
    tSettings.winnersAliases = [];
    tSettings.secondPlaceAliases = [];
    tSettings.firstPlaceAlias = "";
    tSettings.secondPlaceAlias = "";
    tSettings.currentMatch = null;
    tSettings.numberOfBots = 0;
    tSettings.numberOfPlayers = 0;
}

setupGlobalClicksDelegation();

setInitHash();

initWalletConnect();

updateUIforUserMenu();

initAvatarUpload();

function handleHashChange() {
  const hash = location.hash;

  if (hash === '#welcome-page') {
    initWelcomePage();
  } else if (hash === '#profile-page') {
    initProfilePage();
  } else if (hash === '#settings-page') {
    initSettingsPage();
  } else if (hash === '#game-page') {
    game();
  } else if (hash === '#game-ready-page') {
	  initGameReadyPage();
  } else if (hash === '#tournament-page-player-aliases') {
    addAliasesSection();
  } else if (hash === '#user-profile') {
    initUserProfilePage();
  } else if (hash === '#winner-page') {
    initWinnerAnnouncementPage(tSettings);
  }
  else if (hash === '#sign-up-page') {
    initTermsModal();
  }
}

handleHashChange();

window.addEventListener('hashchange', handleHashChange);
