import { Paddle, Ball } from "./types.js";

export function drawPaddle(
  paddle : Paddle,
  ctx: CanvasRenderingContext2D | null,
  width: number, height: number) {

  const radius = 8;
  if (ctx) {
    ctx.fillStyle = 'rgb(70, 61, 61)';
    ctx.beginPath();
    ctx.moveTo(paddle.x + radius, paddle.y);
    ctx.lineTo(paddle.x + width - radius, paddle.y);
    ctx.quadraticCurveTo(paddle.x + width, paddle.y,
      paddle.x + width, paddle.y + radius);
    ctx.lineTo(paddle.x + width, paddle.y + height - radius);
    ctx.quadraticCurveTo(paddle.x + width, paddle.y + height,
      paddle.x + width - radius, paddle.y + height);
    ctx.lineTo(paddle.x + radius, paddle.y + height);
    ctx.quadraticCurveTo(paddle.x, paddle.y + height, paddle.x,
      paddle.y + height - radius);
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
