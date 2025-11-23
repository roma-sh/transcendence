import { game } from "./game.js";
import { tournament } from "./tournament.js";
import { TournamentSettings } from "./types.js";
import { setupBackButton } from "./welcome-page.js";

export function initGameOptionHighlight() {
  const gameOptionEls = document.querySelectorAll('.js-game-option');

  gameOptionEls.forEach((el) => {
    el.addEventListener('click', () => {

      gameOptionEls.forEach((option) => {
        option.classList.remove('game-option-clicked');
      });

      el.classList.add('game-option-clicked');
    });
  });
}

export function useGameOption(tSettings: TournamentSettings) {
  const startButtonEl = document.querySelector('.js-start-button');

  startButtonEl?.addEventListener('click', () => {
    const optionEl = document.querySelector('.game-option-clicked');
    let option;
    if (optionEl instanceof HTMLElement)
      option = optionEl?.dataset.option;

    if (option === 'quick-play') {
      setupBackButton('js-game-page-back-btn', 'choose-mode-page');
      location.hash = 'game-page';
      game();
    } else if (option === 'tournament') {
      setupBackButton('js-tournament-page-back-btn', 'choose-mode-page')
      location.hash = 'tournament-page';
      tournament(tSettings);
    }
  });
}
