export function handleGameOptionSelect(event?: MouseEvent): void {
  const clicked = (event?.target as HTMLElement)?.closest('.js-game-option') as HTMLElement | null;
  if (!clicked) return;

  const options = document.querySelectorAll(
    '.js-game-option') as NodeListOf<HTMLElement>;

  options.forEach((option) => {
    option.style.backgroundColor = 'var(--bg-color-white-seven)';
    option.classList.remove('game-option-clicked');
  });

  clicked.style.backgroundColor = 'rgb(240,238,238)';
  clicked.classList.add('game-option-clicked');
}

export function handleStartGameOption() {
  const optionEl = document.querySelector('.game-option-clicked') as HTMLElement | null;

  let option;
  if (optionEl)
    option = optionEl.dataset.option || '';

  if (option === 'quick-play') {
    location.hash = '#game-page';
  } else if (option === 'tournament') {
    location.hash = '#tournament-page';
  }
}

export function handleGoBackTournament() {
  location.hash = '#choose-mode-page';
}
