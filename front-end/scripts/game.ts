import { Paddle, KeyMap, Ball } from "./types.js";
import { updatePaddleDirection, updateScore } from "./update-game-elems.js";
import {
  drawPaddle,
  drawBall,
  drawDividingLine,
  drawWinText
} from "./draw-game-elems.js";

export function game() {
  let isPaused = false;
  let isWin = false;
  let leftScore = 0;
  let rightScore = 0;
  const maxScore = 10;

  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

  if (!canvas) {
    console.log('there is no such element as gameCanvas');
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.log('error in canvas.getContext');
    return;
  }

  const paddleWidth = 30;
  const paddleHeight = 100;

  const leftPaddle : Paddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0
  };
  const rightPaddle : Paddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0
  };

  let ball : Ball = {
    radius: 10,
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 3
  };

  const keys : KeyMap = {};

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = (Math.random() * 4) - 2;
  }

  function update() {
    if (isPaused) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    if (
      ball.x - ball.radius < leftPaddle.x + paddleWidth &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + paddleHeight
    ) {
      ball.dx = -ball.dx;
      ball.x = leftPaddle.x + paddleWidth + ball.radius;
    }

    if (
      ball.x + ball.radius > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + paddleHeight
    ) {
      ball.dx = -ball.dx;
      ball.x = rightPaddle.x - ball.radius;
    }

    if (ball.x - ball.radius < 0) {
      rightScore++;
      updateScore('.js-right-score', rightScore);
      if (rightScore === maxScore) {
        isPaused = true;
        isWin = true;
        return;
      }
      isPaused = true;
      setTimeout(() => {
        resetBall();
        isPaused = false;
      }, 1500);
    }
    if (ball.x + ball.radius > canvas.width) {
      leftScore++;
      updateScore('.js-left-score', leftScore);
      if (leftScore === maxScore) {
        isPaused = true;
        isWin = true;
        return;
      }
      isPaused = true;
      setTimeout(() => {
        resetBall();
        isPaused = false;
      }, 1500);
    }

    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - paddleHeight), 0);
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - paddleHeight), 0);
  }

  function gameLoop() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(leftPaddle, ctx, paddleWidth, paddleHeight);
    drawPaddle(rightPaddle, ctx, paddleWidth, paddleHeight);
    drawBall(ctx, isPaused, ball);
    drawDividingLine(ctx, canvas);

    if (isWin) {
      const winner = leftScore > rightScore ? 'left' : 'right';
      drawWinText(ctx, canvas, winner);
    }

    update();

    requestAnimationFrame(gameLoop);
  }

  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    updatePaddleDirection(keys, leftPaddle, rightPaddle);
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    updatePaddleDirection(keys, leftPaddle, rightPaddle);
  });

  gameLoop();
}
