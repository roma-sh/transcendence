import {
	GameState, Paddle, KeyMap,
	Ball, GameConfig, ButtonRect
  } from "./types.js";
  import {
	updatePaddleDirection, update, resetBall
  } from "./update-game-elems.js";
  import { bindButtonEvent } from "./interact-game-elems.js";
  import {
	drawPaddle, drawBall, drawDividingLine,
	drawWinText, drawButton, drawScore
  } from "./draw-game-elems.js";
  
  // Νέα βοηθητική συνάρτηση για τη σχεδίαση του ονόματος του παίκτη
  function drawPlayerName(
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	side: 'left' | 'right',
	name: string
  ) {
	ctx.fillStyle = '#00000';
	ctx.font = '20px Arial';
	ctx.textAlign = side === 'left' ? 'left' : 'right';
	
	const x = side === 'left' ? 30 : canvas.width - 30;
	// Τοποθετούμε το όνομα ψηλά, ώστε το σκορ να είναι πιο κάτω
	const y = 30; 
  
	ctx.fillText(name, x, y);
  }
  
  /**
   * Εκκινεί τον βρόχο του παιχνιδιού.
   * Οι παράμετροι player1Name και player2Name είναι προαιρετικές.
   * @param player1Name Το όνομα του παίκτη 1 (Αριστερά).
   * @param player2Name Το όνομα του παίκτη 2 (Δεξιά).
   */
  // ⭐️ ΑΛΛΑΓΗ #1: ΟΡΙΣΜΟΣ ΠΡΟΑΙΡΕΤΙΚΩΝ ΟΡΙΣΜΑΤΩΝ ⭐️
  export function game(player1Name?: string, player2Name?: string) {
	  
	// ⭐️ ΑΛΛΑΓΗ #2: ΟΡΙΣΜΟΣ ΤΕΛΙΚΩΝ ΟΝΟΜΑΤΩΝ ΜΕ FALLBACK ⭐️
	// Αν το όνομα δεν περαστεί, χρησιμοποιείται η προεπιλογή.
	const p1Name = player1Name || "Player 1";
	const p2Name = player2Name || "Player 2";
	  
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
	  maxScore: 5,
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
  
	  // ⭐️ ΑΛΛΑΓΗ #3: ΣΧΕΔΙΑΣΗ ΤΩΝ ΟΝΟΜΑΤΩΝ ⭐️
	  drawPlayerName(ctx!, canvas, 'left', p1Name);
	  drawPlayerName(ctx!, canvas, 'right', p2Name);
  
	  // Το Score θα πρέπει να σχεδιαστεί λίγο πιο κάτω από το όνομα
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
		bindButtonEvent(canvas, playAgainRect, () => {
		  // ⭐️ ΑΛΛΑΓΗ #4: ΠΕΡΑΣΜΑ ΟΝΟΜΑΤΩΝ ΣΤΟ RESTART ⭐️
		  game(p1Name, p2Name);
		});
		const mainMenuRect : ButtonRect
		  = drawButton(ctx, canvas, winner, 'MAIN MENU', 130);
		bindButtonEvent(canvas, mainMenuRect, () => {
		  location.hash = 'choose-mode-page';
		});
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