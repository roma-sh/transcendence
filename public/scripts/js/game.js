import { updatePaddleDirection, update, resetBall } from "./update-game-elems.js";
import { bindButtonEvent } from "./interact-game-elems.js";
import { drawPaddle, drawBall, drawDividingLine, drawWinText, drawButton, drawScore } from "./draw-game-elems.js";
import { updateBotPaddle } from "./bot-ai.js";
import { tSettings } from "./pong.js";
// Νέα βοηθητική συνάρτηση για τη σχεδίαση του ονόματος του παίκτη
function drawPlayerName(ctx, // Τύπος: CanvasRenderingContext2D
canvas, // Τύπος: HTMLCanvasElement
side, // Τύπος: Literal union
name // Τύπος: string
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
async function updatePlayerStats(winnerAlias, loserAlias) {
    // Κλήση στο backend API
    try {
        const response = await fetch('http://localhost:3000/api/updateStats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner: winnerAlias, loser: loserAlias })
        });
        if (response.ok) {
            console.log(`Stats updated successfully for ${winnerAlias} and ${loserAlias}.`);
        }
        else {
            console.error('Failed to update stats:', await response.text());
        }
    }
    catch (error) {
        console.error('Network error while updating stats:', error);
    }
}
/**
 * Εκκινεί τον βρόχο του παιχνιδιού.
 * Οι παράμετροι player1Name και player2Name είναι προαιρετικές.
 * @param player1Name Το όνομα του παίκτη 1 (Αριστερά).
 * @param player2Name Το όνομα του παίκτη 2 (Δεξιά).
 */
export function game(player1Name, player2Name) {
    // 1. Ορισμός ονομάτων (ΠΡΕΠΕΙ να γίνει πρώτο!)
    const p1Name = player1Name || "Player 1";
    const p2Name = player2Name || "Player 2";
    // 2. Ορισμός Bot/Skill
    const BOT_SKILL_LEVEL = 0.6; // 60% skill (Δεν χρειάζεται να είναι εντός της συνάρτησης game)
    const isP1Bot = p1Name.startsWith("Bot ");
    const isP2Bot = p2Name.startsWith("Bot ");
    // Προσθήκη statsSent για να καλέσουμε το API μόνο μία φορά
    const gameState = {
        isPaused: false,
        isWin: false,
        leftScore: 0,
        rightScore: 0,
        statsSent: false // ΝΕΑ ΣΗΜΑΙΑ: Έχουν σταλεί τα στατιστικά;
    };
    const gameConfig = {
        paddleWidth: 30,
        paddleHeight: 100,
        ballRadius: 10,
        maxScore: 2,
        ballInitSpeed: 9
    };
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.log('there is no such element as gameCanvas');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.log('error in canvas.getContext');
        return;
    }
    const leftPaddle = {
        x: 10,
        y: canvas.height / 2 - gameConfig.paddleHeight / 2,
        dy: 0
    };
    const rightPaddle = {
        x: canvas.width - gameConfig.paddleWidth - 10,
        y: canvas.height / 2 - gameConfig.paddleHeight / 2,
        dy: 0
    };
    let ball = {
        radius: gameConfig.ballRadius,
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 0,
        dy: 0
    };
    resetBall(ball, canvas, gameConfig);
    const keys = {};
    function gameLoop() {
        if (ctx)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Σχεδίαση ονομάτων
        if (ctx) {
            drawPlayerName(ctx, canvas, 'left', p1Name);
            drawPlayerName(ctx, canvas, 'right', p2Name);
            drawScore(ctx, canvas, 'left', gameState.leftScore);
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
                tSettings.winnersAliases.push(winnerName);
                console.log(`Winner of this match: ${winnerName}`);
                // ΚΑΛΕΣΜΑ API ΓΙΑ ΣΤΑΤΙΣΤΙΚΑ:
                // Καλούμε μόνο μία φορά, αν δεν έχουν σταλεί τα στατιστικά, και
                // εφόσον και οι δύο παίκτες δεν είναι Bots
                const isPvP = p1Name !== "Player 1" && p2Name !== "Player 2" && !isP1Bot && !isP2Bot;
                if (!gameState.statsSent && isPvP) {
                    updatePlayerStats(winnerName, loserName);
                    gameState.statsSent = true;
                }
                drawWinText(ctx, canvas, winner);
                // const playAgainRect = drawButton(ctx, canvas, winner, 'PLAY AGAIN', 80);
                // bindButtonEvent(canvas, playAgainRect, () => {
                //   game(p1Name, p2Name);
                // });
                if (p1Name == "Player 1" && p2Name == "Player 2") {
                    const mainMenuRect = drawButton(ctx, canvas, winner, 'BACK TO MAIN', 130);
                    bindButtonEvent(canvas, mainMenuRect, () => {
                        location.hash = 'welcome-page';
                    });
                }
                else {
                    console.log("Hello from the next game button");
                    const mainMenuRect = drawButton(ctx, canvas, winner, 'NEXT GAME', 130);
                    bindButtonEvent(canvas, mainMenuRect, () => {
                        location.hash = 'game-ready-page';
                    });
                }
                return; // Τερματισμός του βρόχου παιχνιδιού μετά τη νίκη
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
        return null;
    }
    // Οι listeners πρέπει να λαμβάνουν υπόψη αν ο παίκτης είναι Bot
    window.addEventListener('keydown', (e) => {
        // Το updatePaddleDirection χειρίζεται την κίνηση των ρακέτων με βάση τα πλήκτρα.
        // Αν ο παίκτης είναι Bot, ο listener απλά θα αγνοηθεί για τη ρακέτα του.
        keys[e.key] = true;
        updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        updatePaddleDirection(keys, leftPaddle, rightPaddle);
    });
    gameLoop();
}
