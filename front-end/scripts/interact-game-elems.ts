import { game } from "./game.js";
import { ButtonRect } from "./types.js";

export function setupPlayAgainBtnInteraction(
  canvas: HTMLCanvasElement,
  btnRect : ButtonRect
) {
  const clientRect = canvas.getBoundingClientRect();

  const onClick = (e: MouseEvent) => {
    const mx = e.clientX - clientRect.left;
    const my = e.clientY - clientRect.top;

    if (
      mx >= btnRect.x &&
      mx <= btnRect.x + btnRect.width &&
      my >= btnRect.y &&
      my <= btnRect.y + btnRect.height
    ) {
      canvas.removeEventListener('click', onClick);
      game();
    }
  };

  canvas.addEventListener('click', onClick);
}
