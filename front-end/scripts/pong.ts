import {
  setInitialWelcomePage,
  addHashForChooseModePage
} from './welcome-page.js';
import {
  initGameOptionHighlight,
  useGameOption
} from './choose-mode.js';
import { game } from './game.js';

// for the welcome page:
setInitialWelcomePage();
addHashForChooseModePage();

// for the choose mode page:
initGameOptionHighlight();
useGameOption();

// launch the game
console.log('call game function');
game();
