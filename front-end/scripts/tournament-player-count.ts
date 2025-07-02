import { TournamentSettings } from "./types";

export function registerNextClickAfterCount(
  tSettings: TournamentSettings,
  callback: (tSettings: TournamentSettings) => void) {
  const nextEl = document.querySelector('.js-next-btn-after-count');

  if (!nextEl) return;

  nextEl.addEventListener('click', () => {
    const playerCountEl
      = document.querySelector('#player-count-input') as HTMLInputElement | null;

    if (playerCountEl && playerCountEl.checkValidity()) {
      tSettings.numberOfPlayers = Number(playerCountEl.value);
      callback(tSettings);
    }
  });
}
