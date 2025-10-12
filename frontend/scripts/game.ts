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

  // Νέα βοηθητική συνάρτηση για τη σχεδίαση του ονόματος του παίκτη
  function drawPlayerName(
    ctx: CanvasRenderingContext2D, // Τύπος: CanvasRenderingContext2D
    canvas: HTMLCanvasElement,     // Τύπος: HTMLCanvasElement
    side: 'left' | 'right',        // Τύπος: Literal union
    name: string                   // Τύπος: string
  ) {
    // Διόρθωση χρώματος σε ΛΕΥΚΟ για να φαίνεται στο μαύρο φόντο του Canvas
    ctx.fillStyle = '#';
    // Μικρότερο font και πιο ψηλά για να μην επικαλύπτει το σκορ
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = side === 'left' ? 'left' : 'right';
    
    const x = side === 'left' ? 30 : canvas.width - 30;
    // Διόρθωση θέσης y σε 20 (πιο ψηλά από το 30)
    const y = 20; 
  
    ctx.fillText(name, x, y);
  }
  
  /**
   * Στέλνει αίτημα στο backend για ενημέρωση των στατιστικών παικτών
   * (νίκες, συνολικά παιχνίδια).
   * @param winnerAlias Το ψευδώνυμο του νικητή.
   * @param loserAlias Το ψευδώνυμο του ηττημένου.
   */
  async function updatePlayerStats(winnerAlias: string, loserAlias: string) {
      // Κλήση στο backend API
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

  /**
   * Εκκινεί τον βρόχο του παιχνιδιού.
   * Οι παράμετροι player1Name και player2Name είναι προαιρετικές.
   * @param player1Name Το όνομα του παίκτη 1 (Αριστερά).
   * @param player2Name Το όνομα του παίκτη 2 (Δεξιά).
   */
  export function game(player1Name?: string, player2Name?: string) {
      
    // 1. Ορισμός ονομάτων (ΠΡΕΠΕΙ να γίνει πρώτο!)
    const p1Name = player1Name || "Player 1";
    const p2Name = player2Name || "Player 2";

    // 2. Ορισμός Bot/Skill
    const BOT_SKILL_LEVEL = 0.6; // 60% skill (Δεν χρειάζεται να είναι εντός της συνάρτησης game)
    const isP1Bot = p1Name.startsWith("Bot ");
    const isP2Bot = p2Name.startsWith("Bot ");
      
    // Προσθήκη statsSent για να καλέσουμε το API μόνο μία φορά
    const gameState: GameState & { statsSent: boolean } = { 
      isPaused: false,
      isWin: false,
      leftScore: 0,
      rightScore: 0,
      statsSent: false // ΝΕΑ ΣΗΜΑΙΑ: Έχουν σταλεί τα στατιστικά;
    };
    const gameConfig: GameConfig = { 
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
  
      // Σχεδίαση ονομάτων
      if (ctx) { 
        drawPlayerName(ctx, canvas, 'left', p1Name);
        drawPlayerName(ctx, canvas, 'right', p2Name);
  
        drawScore(ctx, canvas, 'left',  gameState.leftScore);
        drawScore(ctx, canvas, 'right', gameState.rightScore);
  
        drawPaddle(leftPaddle, ctx, gameConfig);
        drawPaddle(rightPaddle, ctx, gameConfig);
        drawBall(ctx, gameState.isPaused, ball);
        drawDividingLine(ctx, canvas);
  
        // Έλεγχος Νίκης
        if (gameState.isWin) {
          const winner = gameState.leftScore > gameState.rightScore ? 'left' : 'right';
          const winnerName = winner === 'left' ? p1Name : p2Name;
          const loserName = winner === 'left' ? p2Name : p1Name;

          // ΚΑΛΕΣΜΑ API ΓΙΑ ΣΤΑΤΙΣΤΙΚΑ:
          // Καλούμε μόνο μία φορά, αν δεν έχουν σταλεί τα στατιστικά, και
          // εφόσον και οι δύο παίκτες δεν είναι Bots
          const isPvP = p1Name !== "Player 1" && p2Name !== "Player 2" && !isP1Bot && !isP2Bot;

          if (!gameState.statsSent && isPvP) {
              updatePlayerStats(winnerName, loserName);
              gameState.statsSent = true; 
          }

          drawWinText(ctx, canvas, winner);
          const playAgainRect = drawButton(ctx, canvas, winner, 'PLAY AGAIN', 80);
          bindButtonEvent(canvas, playAgainRect, () => {
            game(p1Name, p2Name);
          });
          const mainMenuRect = drawButton(ctx, canvas, winner, 'MAIN MENU', 130);
          bindButtonEvent(canvas, mainMenuRect, () => {
            location.hash = 'choose-mode-page';
          });
          return;
        }

        // **********************************************
        // ************ ΛΟΓΙΚΗ ΤΟΥ BOT (AI) *************
        // **********************************************
        if (!gameState.isPaused) {
            // Αν ο P1 είναι Bot (Αριστερή ρακέτα)
            if (isP1Bot) {
                updateBotPaddle(leftPaddle, ball, canvas, gameConfig, BOT_SKILL_LEVEL);
            }
            // Αν ο P2 είναι Bot (Δεξιά ρακέτα)
            if (isP2Bot) {
                updateBotPaddle(rightPaddle, ball, canvas, gameConfig, BOT_SKILL_LEVEL);
            }
        }
        // **********************************************
        
      } // Τέλος ρητού ελέγχου ctx
  
      update(gameState, ball, leftPaddle, rightPaddle, canvas, gameConfig);
  
      requestAnimationFrame(gameLoop);
    }
  
    // Οι listeners πρέπει να λαμβάνουν υπόψη αν ο παίκτης είναι Bot
    window.addEventListener('keydown', (e: KeyboardEvent) => { 
      // Το updatePaddleDirection χειρίζεται την κίνηση των ρακέτων με βάση τα πλήκτρα.
      // Αν ο παίκτης είναι Bot, ο listener απλά θα αγνοηθεί για τη ρακέτα του.
      keys[e.key] = true;
      updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
  
    window.addEventListener('keyup', (e: KeyboardEvent) => { 
      keys[e.key] = false;
      updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
  
    gameLoop();
  }