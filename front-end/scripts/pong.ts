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

if (location.hash === '#game-page') {
  game();
} else if (location.hash === '#tournament-page') {
  tournament(tSettings);
} else if (location.hash === '#tournament-page-player-aliases') {
  addAliasesSection(tSettings);
}
