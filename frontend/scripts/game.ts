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
    ctx: CanvasRenderingContext2D, // Τύπος: CanvasRenderingContext2D
    canvas: HTMLCanvasElement,     // Τύπος: HTMLCanvasElement
    side: 'left' | 'right',        // Τύπος: Literal union
    name: string                   // Τύπος: string
  ) {
    // Διόρθωση χρώματος σε ΛΕΥΚΟ για να φαίνεται στο μαύρο φόντο του Canvas
    ctx.fillStyle = '#00000';
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
  export function game(player1Name?: string, player2Name?: string) { // Τύποι: προαιρετικά strings
      
    const p1Name = player1Name || "Player 1";
    const p2Name = player2Name || "Player 2";
      
    // Προσθήκη statsSent για να καλέσουμε το API μόνο μία φορά
    const gameState: GameState & { statsSent: boolean } = { // Ρητός τύπος
      isPaused: false,
      isWin: false,
      leftScore: 0,
      rightScore: 0,
      statsSent: false // ΝΕΑ ΣΗΜΑΙΑ: Έχουν σταλεί τα στατιστικά;
    };
    const gameConfig: GameConfig = { // Ρητός τύπος
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
  
    const leftPaddle: Paddle = { // Ρητός τύπος
      x: 10,
      y: canvas.height / 2 - gameConfig.paddleHeight / 2,
      dy: 0
    };
    const rightPaddle: Paddle = { // Ρητός τύπος
      x: canvas.width - gameConfig.paddleWidth - 10,
      y: canvas.height / 2 - gameConfig.paddleHeight / 2,
      dy: 0
    };
  
    let ball: Ball = { // Ρητός τύπος
      radius: gameConfig.ballRadius,
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: 0,
      dy: 0
    };
    resetBall(ball, canvas, gameConfig);
  
    const keys: KeyMap = {}; // Ρητός τύπος
  
    function gameLoop() {
      // Καλούμε drawPlayerName μόνο αν το ctx είναι non-null, ωστόσο αυτός ο έλεγχος γίνεται 
      // με ασφάλεια παρακάτω, οπότε μπορούμε να χρησιμοποιήσουμε το ctx κανονικά
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Σχεδίαση ονομάτων
      if (ctx) { // Προσθήκη ρητού ελέγχου πριν τη χρήση του ctx στο gameLoop
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

          // ΚΑΛΕΣΜΑ API ΓΙΑ ΣΤΑΤΙΣΤΙΚΑ:
          // Καλούμε μόνο μία φορά, αν δεν έχουν σταλεί τα στατιστικά, και
          // εφόσον τα ονόματα δεν είναι τα προεπιλεγμένα (δηλαδή είναι εγγεγραμμένοι χρήστες)
          if (!gameState.statsSent && p1Name !== "Player 1" && p2Name !== "Player 2") {
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
      } // Τέλος ρητού ελέγχου ctx
  
      update(gameState, ball, leftPaddle, rightPaddle, canvas, gameConfig);
  
      requestAnimationFrame(gameLoop);
    }
  
    window.addEventListener('keydown', (e: KeyboardEvent) => { // Ρητός τύπος για το event
      keys[e.key] = true;
      updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
  
    window.addEventListener('keyup', (e: KeyboardEvent) => { // Ρητός τύπος για το event
      keys[e.key] = false;
      updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
  
    gameLoop();
  }
