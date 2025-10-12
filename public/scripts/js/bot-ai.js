/**
 * Calculates the movement (dy) for the Bot's paddle based on the ball's position.
 * The paddle movement is limited to the canvas boundaries.
 * @param paddle The Bot's paddle object.
 * @param ball The game's ball object.
 * @param canvas The canvas element for boundary checks.
 * @param paddleHeight The height of the paddle.
 * @param botSkill A number (0 to 1) controlling the Bot's speed and accuracy.
 * A lower number makes the Bot slower (less accurate).
 */
export function updateBotPaddle(paddle, ball, canvas, gameConfig, botSkill = 0.5 // Default skill level (50%)
) {
    // Χρησιμοποιούμε το botSkill για να ορίσουμε την μέγιστη ταχύτητα του Bot.
    // π.χ., max speed * 0.5 (αν skill 0.5)
    const maxSpeed = gameConfig.ballInitSpeed * botSkill * 0.8; // Κάπως πιο αργό από την μπάλα
    const centerOfPaddle = paddle.y + gameConfig.paddleHeight / 2;
    // Όσο χαμηλότερο το skill, τόσο μεγαλύτερο το targetTolerance (περιθώριο λάθους)
    const targetTolerance = 30 * (1 - botSkill);
    // Το Bot ακολουθεί την μπάλα μόνο όταν κινείται προς την πλευρά του (προς το Paddle.x)
    const ballIsMovingTowardsBot = (ball.dx > 0 && paddle.x > canvas.width / 2) ||
        (ball.dx < 0 && paddle.x < canvas.width / 2);
    if (ballIsMovingTowardsBot) {
        if (ball.y < centerOfPaddle - targetTolerance) {
            paddle.dy = -maxSpeed; // Πάνω
        }
        else if (ball.y > centerOfPaddle + targetTolerance) {
            paddle.dy = maxSpeed; // Κάτω
        }
        else {
            paddle.dy = 0; // Σταμάτα
        }
    }
    else {
        // Όταν η μπάλα απομακρύνεται, η ρακέτα σταματά.
        paddle.dy = 0;
    }
    // Ενημέρωση θέσης και έλεγχος ορίων
    paddle.y += paddle.dy;
    if (paddle.y < 0) {
        paddle.y = 0;
    }
    else if (paddle.y + gameConfig.paddleHeight > canvas.height) {
        paddle.y = canvas.height - gameConfig.paddleHeight;
    }
}
