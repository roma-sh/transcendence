import {
  GameState, Paddle, KeyMap,
  Ball, GameConfig, ButtonRect } from "./types.js";
import { updatePaddleDirection, update, resetBall } from "./update-game-elems.js";
import { setupPlayAgainBtnInteraction } from "./interact-game-elems.js";
import {
  drawPaddle, drawBall, drawDividingLine,
  drawWinText, drawButton, drawScore
} from "./draw-game-elems.js";

export function game() {
  const gameState : GameState = {
    isPaused: false,
    isWin: false,
    leftScore: 0,
    rightScore: 0
  };
  const gameConfig : GameConfig = {
    paddleWidth: 30,
    paddleHeight: 100,
    ballRadius: 10,
    maxScore: 1,
    ballInitSpeed: 9
  };

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

  const leftPaddle : Paddle = {
    x: 10,
    y: canvas.height / 2 - gameConfig.paddleHeight / 2,
    dy: 0
  };
  const rightPaddle : Paddle = {
    x: canvas.width - gameConfig.paddleWidth - 10,
    y: canvas.height / 2 - gameConfig.paddleHeight / 2,
    dy: 0
  };

  let ball : Ball = {
    radius: gameConfig.ballRadius,
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 0,
    dy: 0
  };
  resetBall(ball, canvas, gameConfig);

  const keys : KeyMap = {};

  function gameLoop() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScore(ctx, canvas, 'left',  gameState.leftScore);
    drawScore(ctx, canvas, 'right', gameState.rightScore);

    drawPaddle(leftPaddle, ctx, gameConfig);
    drawPaddle(rightPaddle, ctx, gameConfig);
    drawBall(ctx, gameState.isPaused, ball);
    drawDividingLine(ctx, canvas);

    if (gameState.isWin && ctx) {
      const winner = gameState.leftScore > gameState.rightScore ? 'left' : 'right';
      drawWinText(ctx, canvas, winner);
      const playAgainRect : ButtonRect
        = drawButton(ctx, canvas, winner, 'PLAY AGAIN', 80);
      setupPlayAgainBtnInteraction(canvas, playAgainRect);
      // const mainMenuRect : ButtonRect
      //   = drawButton(ctx, canvas, winner, 'MAIN MENU', 130);
      return;
    }

    update(gameState, ball, leftPaddle, rightPaddle, canvas, gameConfig);

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
