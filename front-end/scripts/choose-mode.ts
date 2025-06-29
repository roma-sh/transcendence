import { game } from "./game.js";

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

export function useGameOption() {
  const startButtonEl = document.querySelector('.js-start-button');

  startButtonEl?.addEventListener('click', () => {
    const optionEl = document.querySelector('.game-option-clicked');
    let option;
    if (optionEl instanceof HTMLElement)
      option = optionEl?.dataset.option;

    if (option === 'quick-play') {
      location.hash = 'game-page';
      game();
    }
  });
}
