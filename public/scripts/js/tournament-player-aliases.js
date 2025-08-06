export function generateInputsForAliases(tSettings) {
    let html = '';
    for (let i = 0; i < tSettings.numberOfPlayers; ++i) {
        html += `
      <div>
        <div class="player-photo"></div>
        <input type="text" name="playerAlias" class="player-alias-input
            js-player-alias-input"
          placeholder="Player ${i + 1}">
      </div>
    `;
    }
    const aliaseInputEl = document.querySelector('.aliase-inputs');
    if (aliaseInputEl)
        aliaseInputEl.innerHTML = html;
}
export function registerNextClickAfterAliases(tSettings) {
    const btnEl = document.querySelector('.js-next-btn-after-aliases');
    if (!btnEl)
        return;
    btnEl.addEventListener('click', () => {
        const inputsList = document.querySelectorAll('.js-player-alias-input');
        const inputsArr = Array.from(inputsList);
        const inputValuesArr = inputsArr.map((input) => input.value);
        tSettings.playerAliases = inputValuesArr;
        console.log(tSettings.playerAliases);
    });
}
