
export function tournament() {
  registerNextClickAfterCount(addAliasesSection);
}

function registerNextClickAfterCount(callback: (playerCount: number) => void) {
  const nextEl = document.querySelector('.js-next-btn-after-count');

  if (!nextEl) return;

  nextEl.addEventListener('click', () => {
    const playerCountEl
      = document.querySelector('#player-count-input') as HTMLInputElement | null;

    if (playerCountEl && playerCountEl.checkValidity()) {
      callback(Number(playerCountEl.value));
    }
  });
}

function addAliasesSection(playerCount: number) {
  console.log(`number of players: ${playerCount}`);
  location.hash = 'tournament-page-player-alias';
}
