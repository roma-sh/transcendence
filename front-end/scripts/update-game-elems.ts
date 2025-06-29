import { GameState, KeyMap, Paddle, Ball, GameConfig } from "./types.js";

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

export function update(
  gameState : GameState,
  ball : Ball,
  leftPaddle : Paddle,
  rightPaddle : Paddle,
  canvas : HTMLCanvasElement,
  gameConfig : GameConfig) {

    if (gameState.isPaused) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    if (
      ball.x - ball.radius < leftPaddle.x + gameConfig.paddleWidth &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + gameConfig.paddleHeight
    ) {
      ball.dx = -ball.dx;
      ball.x = leftPaddle.x + gameConfig.paddleWidth + ball.radius;
    }

    if (
      ball.x + ball.radius > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + gameConfig.paddleHeight
    ) {
      ball.dx = -ball.dx;
      ball.x = rightPaddle.x - ball.radius;
    }

    if (ball.x - ball.radius < 0) {
      gameState.rightScore++;
      if (gameState.rightScore === gameConfig.maxScore) {
        gameState.isPaused = true;
        gameState.isWin = true;
        return;
      }
      gameState.isPaused = true;
      setTimeout(() => {
        resetBall(ball, canvas);
        gameState.isPaused = false;
      }, 1500);
    }
    if (ball.x + ball.radius > canvas.width) {
      gameState.leftScore++;
      if (gameState.leftScore === gameConfig.maxScore) {
        gameState.isPaused = true;
        gameState.isWin = true;
        return;
      }
      gameState.isPaused = true;
      setTimeout(() => {
        resetBall(ball, canvas);
        gameState.isPaused = false;
      }, 1500);
    }

    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    leftPaddle.y = Math.max(Math.min(leftPaddle.y,
      canvas.height - gameConfig.paddleHeight), 0);
    rightPaddle.y = Math.max(Math.min(rightPaddle.y,
      canvas.height - gameConfig.paddleHeight), 0);
}

function resetBall(ball : Ball, canvas : HTMLCanvasElement) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.dy = (Math.random() * 4) - 2;
}
