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
  import { updateBotPaddle } from "./bot-ai.js";
  import { tSettings } from "./pong.js";

  function drawPlayerName(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,   
    side: 'left' | 'right',     
    name: string                 
  ) {
    ctx.fillStyle = '#';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = side === 'left' ? 'left' : 'right';
    
    const x = side === 'left' ? 30 : canvas.width - 30;
    const y = 20; 
  
    ctx.fillText(name, x, y);
  }
  
  /**
   * @param winnerAlias 
   * @param loserAlias 
   */
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

  export function game(player1Name?: string, player2Name?: string): void {

    const p1Name = player1Name || "Player 1";
    const p2Name = player2Name || "Player 2";

    const BOT_SKILL_LEVEL = 0.6;
    const isP1Bot = p1Name.startsWith("Bot ");
    const isP2Bot = p2Name.startsWith("Bot ");
      
    const gameState: GameState & { statsSent: boolean } = { 
      isPaused: false,
      isWin: false,
      leftScore: 0,
      rightScore: 0,
      statsSent: false
    };
    const gameConfig: GameConfig = { 
      paddleWidth: 30,
      paddleHeight: 100,
      ballRadius: 10,
      maxScore: 2,
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
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      if (ctx) { 
        drawPlayerName(ctx, canvas, 'left', p1Name);
        drawPlayerName(ctx, canvas, 'right', p2Name);
  
        drawScore(ctx, canvas, 'left',  gameState.leftScore);
        drawScore(ctx, canvas, 'right', gameState.rightScore);
  
        drawPaddle(leftPaddle, ctx, gameConfig);
        drawPaddle(rightPaddle, ctx, gameConfig);
        drawBall(ctx, gameState.isPaused, ball);
        drawDividingLine(ctx, canvas);
  
        if (gameState.isWin) {
          const winner = gameState.leftScore > gameState.rightScore ? 'left' : 'right';
          const winnerName = winner === 'left' ? p1Name : p2Name;
          const loserName = winner === 'left' ? p2Name : p1Name;

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

          drawWinText(ctx, canvas, winner);

          if (p1Name == "Player 1" && p2Name == "Player 2")
          {
            const mainMenuRect = drawButton(ctx, canvas, winner, 'BACK TO MAIN', 130);
            bindButtonEvent(canvas, mainMenuRect, () => {
              location.hash = 'welcome-page';
          });
          }
          else
          {
            console.log("Hello from the next game button");
            const mainMenuRect = drawButton(ctx, canvas, winner, 'NEXT GAME', 130);
            bindButtonEvent(canvas, mainMenuRect, () => {
              location.hash = 'game-ready-page';
            });
          }
          return;
        }

        if (!gameState.isPaused) {
            if (isP1Bot) 
            {
                updateBotPaddle(leftPaddle, ball, canvas, gameConfig, BOT_SKILL_LEVEL);
            }
            if (isP2Bot)
            {
                updateBotPaddle(rightPaddle, ball, canvas, gameConfig, BOT_SKILL_LEVEL);
            }
        } 
      }
  
      update(gameState, ball, leftPaddle, rightPaddle, canvas, gameConfig);
  
      requestAnimationFrame(gameLoop);
      return null;
    }
  
    window.addEventListener('keydown', (e: KeyboardEvent) => { 
      keys[e.key] = true;
      updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
  
    window.addEventListener('keyup', (e: KeyboardEvent) => { 
      keys[e.key] = false;
      updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
  
    gameLoop();
  }