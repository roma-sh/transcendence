import { KeyMap, Paddle } from "./types.js";

export function updatePaddleDirection (
  keys : KeyMap,
  leftPaddle : Paddle,
  rightPaddle : Paddle) {

  if (keys['w'] || keys['W']) {
    leftPaddle.dy = -7;
  } else if (keys['s'] || keys['S']) {
    leftPaddle.dy = 7;
  } else {
    leftPaddle.dy = 0;
  }

  if (keys['ArrowUp']) {
    rightPaddle.dy = -7;
  } else if (keys['ArrowDown']) {
    rightPaddle.dy = 7;
  } else {
    rightPaddle.dy = 0;
  }
}

export function updateScore(score_side: string, score: number) {
  const scoreEl = document.querySelector(score_side);
  if (scoreEl) scoreEl.innerHTML = score.toString();
}
