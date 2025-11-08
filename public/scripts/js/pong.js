import { setInitialWelcomePage, addHashForChooseModePage } from './welcome-page.js';
import { initGameOptionHighlight, useGameOption } from './choose-mode.js';
import { tournament, addAliasesSection } from "./tournament.js";
import { initSignUpPage, initLogInPage } from './auth-pages.js';
import { initUserProfilePage } from './user-profile.js';
import { initGameReadyPage } from './game-ready-page.js';
import { initWalletConnect } from './wallet-connect.js';
import { initWinnerAnnouncementPage } from './winner-page.js';
export const tSettings = {
    numberOfPlayers: 1,
    numberOfBots: 0,
    playerAliases: [],
    winnersAliases: [],
    secondPlaceAliases: [],
    secondPlaceAlias: "",
    firstPlaceAlias: ""
};
// for the welcome page:
setInitialWelcomePage();
addHashForChooseModePage();
// for the choose mode page:
initGameOptionHighlight();
useGameOption(tSettings);
// Initialize wallet connection - add this after the other initializations
initWalletConnect();
// Function to handle hash-based navigation
function handleHashChange() {
    const hash = location.hash;
    if (hash === '#game-ready-page') {
        initGameReadyPage(tSettings);
    }
    else if (hash === '#tournament-page') {
        tournament(tSettings);
    }
    else if (hash === '#tournament-page-player-aliases') {
        addAliasesSection(tSettings);
    }
    else if (hash === '#sign-up-page') {
        initSignUpPage();
    }
    else if (hash === '#log-in-page') {
        initLogInPage();
    }
    else if (hash === '#user-profile') {
        initUserProfilePage();
    }
    else if (hash.startsWith('#winner-page')) {
        initWinnerAnnouncementPage(tSettings);
    }
}
// Run on initial load
handleHashChange();
// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);
