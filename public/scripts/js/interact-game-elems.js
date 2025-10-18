export function bindButtonEvent(canvas, btnRect, callback) {
    const clientRect = canvas.getBoundingClientRect();
    const onClick = (e) => {
        const mx = e.clientX - clientRect.left;
        const my = e.clientY - clientRect.top;
        if (mx >= btnRect.x &&
            mx <= btnRect.x + btnRect.width &&
            my >= btnRect.y &&
            my <= btnRect.y + btnRect.height) {
            canvas.removeEventListener('click', onClick);
            callback();
        }
    };
    canvas.addEventListener('click', onClick);
}
