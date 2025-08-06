export function registerNextClickAfterCount(tSettings, callback) {
    const nextEl = document.querySelector('.js-next-btn-after-count');
    if (!nextEl)
        return;
    nextEl.addEventListener('click', () => {
        const playerCountEl = document.querySelector('#player-count-input');
        if (playerCountEl && playerCountEl.checkValidity()) {
            tSettings.numberOfPlayers = Number(playerCountEl.value);
            callback(tSettings);
        }
    });
}
