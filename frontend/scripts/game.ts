import {
  GameState, Paddle, KeyMap,
  Ball, GameConfig
} from "./types.js";
import {
  updatePaddleDirection, update, resetBall
} from "./update-game-elems.js";
import { bindButtonEvent } from "./interact-game-elems.js";
import {
  drawPaddle, drawBall, drawDividingLine,
  drawWinText, drawButton, drawScore, drawPlayerName
} from "./draw-game-elems.js";
import { updateBotPaddle } from "./bot-ai.js";
import { tSettings } from "./pong.js";
import { loadGameSettings } from "./settings-page.js";
import { apiHeaders } from "./api-config.js";

let animationId: number | null = null;

let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
let keyupHandler: ((e: KeyboardEvent) => void) | null = null;

function cleanupGame() {
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
    dy: 0
  };
  const rightPaddle: Paddle = { 
    x: canvas.width - gameConfig.paddleWidth - 10,
    y: canvas.height / 2 - gameConfig.paddleHeight / 2,
    dy: 0
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
    keys[e.code] = true;
    updatePaddleDirection(keys, leftPaddle, rightPaddle, settings);
  };
  keyupHandler = (e: KeyboardEvent) => { 
    keys[e.code] = false;
    updatePaddleDirection(keys, leftPaddle, rightPaddle, settings);
  };

  window.addEventListener('keydown', keydownHandler);
  window.addEventListener('keyup', keyupHandler);

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

	// 1. Διαχείριση Τουρνουά
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
		console.error("Failed to update stats with new API:", error);
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
		location.hash = '#game-page';
		} else {
		location.hash = nextGameHash;
		}
	});
}

async function recordWin() {
    try {
        await fetch('/api/game/wins', { method: 'POST', credentials: 'include', headers: apiHeaders() });
        console.log("Win recorded successfully.");
    } catch (error) {
        console.error("Error recording win:", error);
    }
}

async function recordTotalGame() {
    try {
        await fetch('/api/game/total-games', { method: 'POST', credentials: 'include', headers: apiHeaders() });
        console.log("Total game recorded successfully.");
    } catch (error) {
        console.error("Error recording total game:", error);
    }
}

async function getLoggedInUserAlias(): Promise<string | null> {
    try {
        const response = await fetch('/api/profile', { method: 'GET', credentials: 'include', headers: apiHeaders() });
        if (response.ok) {
            const data = await response.json();
            return data.user.username;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
    return null;
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
