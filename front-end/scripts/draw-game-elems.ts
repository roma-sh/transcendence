import { Paddle, Ball, GameConfig } from "./types.js";

export function drawPaddle(
  paddle : Paddle,
  ctx: CanvasRenderingContext2D | null,
  gameConfig : GameConfig) {

  const radius = 8;
  if (ctx) {
    ctx.fillStyle = 'rgb(70, 61, 61)';
    ctx.beginPath();
    ctx.moveTo(paddle.x + radius, paddle.y);
    ctx.lineTo(paddle.x + gameConfig.paddleWidth - radius, paddle.y);
    ctx.quadraticCurveTo(paddle.x + gameConfig.paddleWidth, paddle.y,
      paddle.x + gameConfig.paddleWidth, paddle.y + radius);
    ctx.lineTo(paddle.x + gameConfig.paddleWidth,
      paddle.y + gameConfig.paddleHeight - radius);
    ctx.quadraticCurveTo(paddle.x + gameConfig.paddleWidth,
      paddle.y + gameConfig.paddleHeight,
      paddle.x + gameConfig.paddleWidth - radius,
      paddle.y + gameConfig.paddleHeight);
    ctx.lineTo(paddle.x + radius, paddle.y + gameConfig.paddleHeight);
    ctx.quadraticCurveTo(paddle.x, paddle.y + gameConfig.paddleHeight,
      paddle.x, paddle.y + gameConfig.paddleHeight - radius);
    ctx.lineTo(paddle.x, paddle.y + radius);
    ctx.quadraticCurveTo(paddle.x, paddle.y, paddle.x + radius, paddle.y);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawBall(
  ctx: CanvasRenderingContext2D | null,
  isPaused : boolean,
  ball : Ball ) {

  if (isPaused) return;
  if (ctx) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = '#FFA500';
    ctx.fill();
    ctx.closePath();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}

export function drawDividingLine(
  ctx: CanvasRenderingContext2D | null,
  canvas : HTMLCanvasElement) {

  if (ctx) {
    ctx.strokeStyle = 'rgb(165, 162, 162)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export function drawWinText(
  ctx: CanvasRenderingContext2D | null,
  canvas : HTMLCanvasElement,
  winner : 'left' | 'right') {
    if (!ctx) return;

    const text = 'WIN';
    ctx.font = "48px Arial";
    const textWidth = ctx.measureText(text).width;

    const leftCoords = {
      x: canvas.width / 4 - textWidth / 2,
      y: canvas.height / 2,
    };
    const rightCoords = {
      x: canvas.width * (3 / 4) - textWidth / 2,
      y: canvas.height / 2,
    };

    if (winner === 'left') {
      ctx.fillText('WIN', leftCoords.x, leftCoords.y);
    } else {
      ctx.fillText('WIN', rightCoords.x, rightCoords.y);
    }
}

export function drawPlayAgainButton(
  ctx: CanvasRenderingContext2D | null,
  canvas : HTMLCanvasElement,
  winner : 'left' | 'right') {}
