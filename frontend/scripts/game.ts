import {
  GameState, Paddle, KeyMap,
  Ball, GameConfig
} from "./types.js";
import {
  updatePaddleDirection, update, resetBall
} from "./update-game-elems.js";
import {
  drawPaddle, drawBall, drawDividingLine,
  drawWinText, drawButton, drawScore, drawPlayerName
} from "./draw-game-elems.js";
import { updateBotPaddle } from "./bot-ai.js";
import { tSettings } from "./pong.js";
import { loadGameSettings } from "./settings-page.js";
import { apiHeaders } from "./api-config.js";
import { ButtonRect } from "./types.js";


let animationId: number | null = null;

let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
let keyupHandler: ((e: KeyboardEvent) => void) | null = null;

let cleanupGame: () => void = () => {
  window.onpopstate = null;
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler);
  }
  if (keyupHandler) {
    window.removeEventListener('keyup', keyupHandler);
  }
};

export function escapeHTML(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (match) => {
    const escapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapes[match];
  });
}

export function game(): void {

  cleanupGame();

  let settings = loadGameSettings();

  let p1Name = "Player 1";
  let p2Name = "Player 2";

  if (tSettings.currentMatch) {
    p1Name = tSettings.currentMatch.p1Name;
    p2Name = tSettings.currentMatch.p2Name;
  }

  const BOT_SKILL_LEVEL = 0.6;
  const isP1Bot = p1Name.startsWith("Bot ");
  const isP2Bot = p2Name.startsWith("Bot ");
    
  const gameState: GameState = {
    isPaused: false,
    isWin: false,
    leftScore: 0,
    rightScore: 0,
    statsSent: false,
    winHandled: false,
    winnerSide: 'left'
  };

  const gameConfig: GameConfig = { 
    paddleWidth: 30,
    paddleHeight: 100,
    ballRadius: 10,
    maxScore: settings.scoreToWin,
    ballInitSpeed: settings.ballSpeed + 5
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

  const leftPaddle: Paddle = { 
    x: 10,
    y: canvas.height / 2 - gameConfig.paddleHeight / 2,
    dy: 0,
    freezeTimer: 0
  };
  const rightPaddle: Paddle = { 
    x: canvas.width - gameConfig.paddleWidth - 10,
    y: canvas.height / 2 - gameConfig.paddleHeight / 2,
    dy: 0,
    freezeTimer: 0

  };

  let ball: Ball = { 
    radius: gameConfig.ballRadius,
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 0,
    dy: 0
  };
  resetBall(ball, canvas, gameConfig);

  const keys: KeyMap = {}; 

  gameState.isPaused = true;
  startCountdown(() => {
    gameState.isPaused = false;
  });

  function gameLoop() {
    if (!ctx) return;

    function drawBaseFrame() {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = settings.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawPlayerName(ctx, canvas, 'left', p1Name);
      drawPlayerName(ctx, canvas, 'right', p2Name);

      drawScore(ctx, canvas, 'left',  gameState.leftScore);
      drawScore(ctx, canvas, 'right', gameState.rightScore);

      drawPaddle(leftPaddle, ctx, gameConfig, settings);
      drawPaddle(rightPaddle, ctx, gameConfig, settings);
      drawBall(ctx, gameState.isPaused, ball, settings);
      drawDividingLine(ctx, canvas);
    }

    drawBaseFrame();

    if (gameState.isWin) {
      handleWinOnce(gameState, p1Name, p2Name, isP1Bot, isP2Bot, canvas, ctx);
      drawWinText(ctx, canvas, gameState.winnerSide);
      return;
    }

    if (!gameState.isPaused) {
      if (isP1Bot) {
        updateBotPaddle(leftPaddle, ball, canvas, gameConfig, BOT_SKILL_LEVEL);
      }
      if (isP2Bot) {
        updateBotPaddle(rightPaddle, ball, canvas, gameConfig, BOT_SKILL_LEVEL);
      }
    }

    update(gameState, ball, leftPaddle, rightPaddle, canvas, gameConfig);

    animationId = requestAnimationFrame(gameLoop);
    return;
  }

  keydownHandler = (e: KeyboardEvent) => {
    if (isP1Bot && (e.code === 'KeyW' || e.code === 'KeyS')) return;
    if (isP2Bot && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) return;

    keys[e.code] = true;
    updatePaddleDirection(keys, leftPaddle, rightPaddle, settings);
  };
  keyupHandler = (e: KeyboardEvent) => {
    keys[e.code] = false;
    updatePaddleDirection(keys, leftPaddle, rightPaddle, settings);
  };

  const touchHandler = (e: TouchEvent) => {
    if (!gameState.isWin && e.cancelable) {
        e.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    if (gameState.isWin) {
        if (e.type === 'touchstart') {
            const pointerEvent = new PointerEvent('pointerdown', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true,
                pointerType: 'touch'
            });
            canvas.dispatchEvent(pointerEvent);

            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true
            });
            canvas.dispatchEvent(clickEvent);
        }
        return; 
    }

    const scaleY = canvas.height / rect.height;
    const canvasY = (touch.clientY - rect.top) * scaleY;

    if (touch.clientX - rect.left < rect.width / 2) {
      if (!isP1Bot) leftPaddle.y = canvasY - gameConfig.paddleHeight / 2;
    } else {
      if (!isP2Bot) rightPaddle.y = canvasY - gameConfig.paddleHeight / 2;
    }

    [leftPaddle, rightPaddle].forEach(p => {
      if (p.y < 0) p.y = 0;
      if (p.y > canvas.height - gameConfig.paddleHeight) 
        p.y = canvas.height - gameConfig.paddleHeight;
    });
  };

  window.addEventListener('keydown', keydownHandler);
  window.addEventListener('keyup', keyupHandler);
  
  canvas.addEventListener('touchstart', touchHandler, { passive: false });
  canvas.addEventListener('touchmove', touchHandler, { passive: false });

  const originalCleanup = cleanupGame;
  cleanupGame = () => {
    originalCleanup();
    canvas.removeEventListener('touchstart', touchHandler);
    canvas.removeEventListener('touchmove', touchHandler);
  };

  gameLoop();
}

async function handleWinOnce(
	gameState: GameState,
	p1Name: string,
	p2Name: string,
	isP1Bot: boolean,
	isP2Bot: boolean,
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D
) 
{
	if (gameState.winHandled) return;
	gameState.winHandled = true;

	console.log("--- handleWinOnce Triggered ---");

	const winnerSide = gameState.leftScore > gameState.rightScore ? 'left' : 'right';
	const winnerName = winnerSide === 'left' ? p1Name : p2Name;
	const loserName = winnerSide === 'left' ? p2Name : p1Name;

	gameState.winnerSide = winnerSide;

	const isTournamentMatch = tSettings.currentMatch !== null;
	if (isTournamentMatch) {
		tSettings.winnersAliases.push(winnerName);
		if (tSettings.playerAliases.length === 2 || tSettings.playerAliases.length === 0) {
		tSettings.secondPlaceAliases.push(loserName);
		}
	}

	if (!gameState.statsSent) {
		try {
		const response = await fetch('/api/profile', { method: 'GET', credentials: 'include', headers: apiHeaders() });
		const data = await response.json();
		if (!data.success || !data.user) return;
		const loggedInAlias = data.user.username;

		if (loggedInAlias === p1Name || loggedInAlias === p2Name) {
			
			await fetch('/api/game/total-games', { method: 'POST', credentials: 'include', headers: apiHeaders() });
			console.log("Total games incremented for logged-in user.");

			if (loggedInAlias === winnerName) {
			await fetch('/api/game/wins', { method: 'POST', credentials: 'include', headers: apiHeaders() });
			console.log("Win recorded for logged-in user.");
			}
		}

		} catch (error) {
		}
		gameState.statsSent = true; 
	}

	const isLastMatchOfRound = isTournamentMatch && tSettings.playerAliases.length === 0;
		
	const isFinalMatch = isLastMatchOfRound && (tSettings.winnersAliases.length === 1 && tSettings.numberOfPlayers === 2);

	if (isFinalMatch) {
		console.log("🏁 Final match finished. Redirecting to winner page automatically...");
		setTimeout(() => {
			location.hash = '#game-ready-page'; 
		}, 500);
		return; 
	}

	const nextGameHash = isTournamentMatch ? '#game-ready-page' : '#game-page';

	const backBtnRect = drawButton(ctx, canvas, gameState.winnerSide, 'BACK TO MAIN', 130);
	bindButtonEvent(canvas, backBtnRect, () => {
		tSettings.currentMatch = null; 
		tSettings.winnersAliases = [];
		location.hash = '#welcome-page';
	});

	const nextBtnRect = drawButton(ctx, canvas, gameState.winnerSide, 'NEXT GAME', 180);
	bindButtonEvent(canvas, nextBtnRect, () => {
		if (!isTournamentMatch) {
    cleanupGame();
    
    location.hash = '#game-page'; 
    game();
		} else {
		location.hash = nextGameHash;
		}
	});
}

function startCountdown(startGame: () => void) {
  const countdownEl = document.querySelector(
    '.countdown-overlay') as HTMLElement | null;

  if (!countdownEl) return;

  let count = 3;
  countdownEl.textContent = String(count);
  countdownEl.classList.remove('hidden');
  countdownEl.classList.add('flex');

  const interval = setInterval(() => {
    count--;

    if (count > 0) {
      countdownEl.textContent = String(count);
    } else {
      clearInterval(interval);
      countdownEl.classList.add('hidden');
      countdownEl.classList.remove('flex');
      startGame();
    }
  }, 1000);
}

function bindButtonEvent(
  canvas: HTMLCanvasElement,
  btnRect : ButtonRect,
  callback: () => void
) {
  const onClick = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;  
    const scaleY = canvas.height / rect.height;

    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    if (
      mx >= btnRect.x &&
      mx <= btnRect.x + btnRect.width &&
      my >= btnRect.y &&
      my <= btnRect.y + btnRect.height
    ) {
      canvas.removeEventListener('click', onClick);
      callback();
    }
  };

  canvas.addEventListener('mousedown', onClick);
}