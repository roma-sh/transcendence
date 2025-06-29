import {
  setInitialWelcomePage,
  addHashForChooseModePage
} from './welcome-page.js';
import {
  initGameOptionHighlight,
  useGameOption
} from './choose-mode.js';

// for the welcome page:
setInitialWelcomePage();
addHashForChooseModePage();

// for the choose mode page:
initGameOptionHighlight();
useGameOption();
