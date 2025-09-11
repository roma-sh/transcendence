import { ButtonRect } from "./types.js";

export function bindButtonEvent(
  canvas: HTMLCanvasElement,
  btnRect : ButtonRect,
  callback: () => void
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
      callback();
    }
  };

  canvas.addEventListener('click', onClick);
}
