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
    ballInitSpeed: settings.ballSpeed
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

function handleWinOnce(
  gameState: GameState,
  p1Name: string,
  p2Name: string,
  isP1Bot: boolean,
  isP2Bot: boolean,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  if (gameState.winHandled) return;
  gameState.winHandled = true;

  const winner = gameState.leftScore > gameState.rightScore ? 'left' : 'right';
  const winnerName = winner === 'left' ? p1Name : p2Name;
  const loserName = winner === 'left' ? p2Name : p1Name;

  gameState.winnerSide = winner;

  tSettings.winnersAliases.push(winnerName);

  console.log("Length of player Aliases list : ", tSettings.playerAliases.length);
  if (tSettings.playerAliases.length == 2 || tSettings.playerAliases.length == 0)
  {
    tSettings.secondPlaceAliases.push(loserName);
    console.log("Losers for second place of this match:", tSettings.secondPlaceAliases);
  }
  console.log(`Winner of this match: ${winnerName}`);

  const isPvP = p1Name !== "Player 1" && p2Name !== "Player 2" && !isP1Bot && !isP2Bot;

  if (!gameState.statsSent && isPvP) {
      updatePlayerStats(winnerName, loserName);
      gameState.statsSent = true; 
  }

  const hasNamedPlayers = (p1Name !== "Player 1" && p2Name !== "Player 2");
  const nextGameHash    = hasNamedPlayers ? '#game-ready-page' : '#game-page';

  const backBtnRect = drawButton(ctx, canvas, gameState.winnerSide, 'BACK TO MAIN', 130);
  bindButtonEvent(canvas, backBtnRect, () => {
    location.hash = '#welcome-page';
  });

  const nextBtnRect = drawButton(ctx, canvas, gameState.winnerSide, 'NEXT GAME', 180);
  bindButtonEvent(canvas, nextBtnRect, () => {
    /** Reset hash first so hashchange fires
     * even when navigating to the same page */
    location.hash = '';
    location.hash = nextGameHash;
  });
}

async function updatePlayerStats(winnerAlias: string, loserAlias: string) {
    try {
        const response = await fetch('http://localhost:3000/api/updateStats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner: winnerAlias, loser: loserAlias })
        });

        if (response.ok) {
            console.log(`Stats updated successfully for ${winnerAlias} and ${loserAlias}.`);
        } else {
            console.error('Failed to update stats:', await response.text());
        }
    } catch (error) {
        console.error('Network error while updating stats:', error);
    }
}
