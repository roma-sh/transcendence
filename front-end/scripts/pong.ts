import {
  setInitialWelcomePage,
  addHashForChooseModePage
} from './welcome-page.js';
import {
  initGameOptionHighlight,
  useGameOption
} from './choose-mode.js';
import { game } from './game.js';
import { tournament } from "./tournament.js";

// for the welcome page:
setInitialWelcomePage();
addHashForChooseModePage();

// for the choose mode page:
initGameOptionHighlight();
useGameOption();

if (location.hash === '#game-page') {
  game();
} else if (location.hash === '#tournament-page') {
  tournament();
}
