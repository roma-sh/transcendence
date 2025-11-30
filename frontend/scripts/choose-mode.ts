import { game } from "./game.js";

export function handleGameOptionSelect(event?: MouseEvent): void {
  const clicked = (event?.target as HTMLElement)?.closest('.js-game-option') as HTMLElement | null;
  if (!clicked) return;

  const options = document.querySelectorAll('.js-game-option');

  options.forEach((option) => {
    option.classList.remove('game-option-clicked');
  });

  clicked.classList.add('game-option-clicked');
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
    } else if (option === 'tournament') {
      location.hash = '#tournament-page';
    }
  });
}

export function handleGoBackTournament() {
  location.hash = '#choose-mode-page';
}
