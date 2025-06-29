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

    function bounceOffPaddle(paddle: Paddle, isLeft: boolean) {
      const paddleCenterY = paddle.y + gameConfig.paddleHeight / 2;
      const relativeY = ball.y - paddleCenterY;
      const normY = relativeY / (gameConfig.paddleHeight / 2);
      const maxAngle = Math.PI / 4;
      const bounceAngle = normY * maxAngle;

      const speed = Math.hypot(ball.dx, ball.dy);

      const dir = isLeft ? 1 : -1;
      ball.dx = speed * Math.cos(bounceAngle) * dir;
      ball.dy = speed * Math.sin(bounceAngle);
    }

    if (
      ball.x - ball.radius < leftPaddle.x + gameConfig.paddleWidth &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + gameConfig.paddleHeight
    ) {
      ball.x = leftPaddle.x + gameConfig.paddleWidth + ball.radius;
      bounceOffPaddle(leftPaddle, true);
    }

    if (
      ball.x + ball.radius > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + gameConfig.paddleHeight
    ) {
      ball.x = rightPaddle.x - ball.radius;
      bounceOffPaddle(rightPaddle, false);
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
        resetBall(ball, canvas, gameConfig);
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
        resetBall(ball, canvas, gameConfig);
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

export function resetBall(
  ball: Ball,
  canvas: HTMLCanvasElement,
  gameConfig: GameConfig
) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  const maxAngle = Math.PI / 4;
  const angle = (Math.random() * 2 - 1) * maxAngle;

  const dir = Math.random() < 0.5 ?  1 : -1;
  const speed = gameConfig.ballInitSpeed;

  ball.dx = dir * speed * Math.cos(angle);
  ball.dy = speed * Math.sin(angle);
}
