import { Paddle, Ball, GameConfig, ButtonRect, GameSettings } from "./types.js";

export function drawScore (
  ctx: CanvasRenderingContext2D | null,
  canvas : HTMLCanvasElement,
  side: 'left' | 'right',
  score: number
) {
  if (!ctx) return;

  const fontSize = 32;
  const paddingY = 20;

  ctx.fillStyle = 'rgb(70, 61, 61)';
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';

  const x = side === 'left'
    ? canvas.width  / 4
    : (canvas.width * 3) / 4;

  ctx.fillText(String(score), x, paddingY);
}

export function drawPaddle(
  paddle : Paddle,
  ctx: CanvasRenderingContext2D | null,
  gameConfig : GameConfig,
  settings : GameSettings) {

  const radius = 8;
  if (ctx) {
    ctx.fillStyle = settings.paddleColor;
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
  ball : Ball,
  settings : GameSettings) {

  if (isPaused) return;
  if (ctx) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = settings.ballColor;
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
  ctx: CanvasRenderingContext2D,
  canvas : HTMLCanvasElement,
  winner : 'left' | 'right') {

    const text = 'WIN';
    ctx.fillStyle = '#463D3D';
    ctx.font = "48px Arial";
    ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';

    const leftCoords = {
      x: canvas.width / 4,
      y: canvas.height / 2,
    };
    const rightCoords = {
      x: canvas.width * (3 / 4),
      y: canvas.height / 2,
    };

    const pos = winner === 'left' ? leftCoords : rightCoords;
    ctx.fillText('WIN', pos.x, pos.y);
}

export function drawButton (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  winner: 'left' | 'right',
  btnText: string,
  yMargin: number,
) : ButtonRect {

  const btnWidth = 150;
  const btnHeight = 40;
  const radius = btnHeight / 2;

  const centerX =
    winner === 'left'
      ? canvas.width  / 4
      : (canvas.width * 3) / 4;
  const centerY = canvas.height / 2 + yMargin;

  const x = centerX - btnWidth / 2;
  const y = centerY - btnHeight / 2;

  ctx.fillStyle = 'rgb(70, 61, 61)';
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + btnWidth - radius, y);
  ctx.quadraticCurveTo(x + btnWidth,y, x + btnWidth, y + radius);
  ctx.lineTo(x + btnWidth, y + btnHeight - radius);
  ctx.quadraticCurveTo(x + btnWidth, y + btnHeight,
    x + btnWidth - radius, y + btnHeight);
  ctx.lineTo(x + radius, y + btnHeight);
  ctx.quadraticCurveTo(x, y + btnHeight,
    x, y + btnHeight - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '18px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(btnText, centerX, centerY);

  return { x, y, width: btnWidth, height: btnHeight };
}
