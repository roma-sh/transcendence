import { ButtonRect } from "./types.js";

export function bindButtonEvent(
  canvas: HTMLCanvasElement,
  btnRect : ButtonRect,
  callback: () => void
) {
  const onClick = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();

    // Υπολογίζουμε πόσο έχει "τεντωθεί" ή "μαζέψει" το canvas στην οθόνη
    const scaleX = canvas.width / rect.width;   // π.χ. 800 / 350
    const scaleY = canvas.height / rect.height; // π.χ. 500 / 218

    // Πολλαπλασιάζουμε το κλικ με το scale για να βρούμε την "εσωτερική" θέση
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    console.log(`Click at: ${mx}, ${my} | Target: ${btnRect.x}, ${btnRect.y}`);

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

  // Σημαντικό: Χρησιμοποιούμε 'mousedown' ή 'pointerdown' για καλύτερη απόκριση σε αφή
  canvas.addEventListener('mousedown', onClick);
}

// export function bindButtonEvent(
//   canvas: HTMLCanvasElement,
//   btnRect : ButtonRect,
//   callback: () => void
// ) {
//   const clientRect = canvas.getBoundingClientRect();

//   const onClick = (e: MouseEvent) => {
//     const mx = e.clientX - clientRect.left;
//     const my = e.clientY - clientRect.top;

//     if (
//       mx >= btnRect.x &&
//       mx <= btnRect.x + btnRect.width &&
//       my >= btnRect.y &&
//       my <= btnRect.y + btnRect.height
//     ) {
//       canvas.removeEventListener('click', onClick);
//       callback();
//     }
//   };

//   canvas.addEventListener('click', onClick);
// }
