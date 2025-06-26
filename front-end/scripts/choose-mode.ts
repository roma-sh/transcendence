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
