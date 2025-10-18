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
export function updateBotPaddle(paddle, ball, canvas, gameConfig, botSkill = 0.5) {
    // 1. Speed Setting - EXTREMELY SLOW
    // Max Speed is set to 20% of the initial ball speed, scaled by skill.
    // 💡 To make the bot faster, increase '0.2' (e.g., change to 0.5).
    const maxSpeed = gameConfig.ballInitSpeed * 0.2 * botSkill;
    const centerOfPaddle = paddle.y + gameConfig.paddleHeight / 2;
    // 2. Target Tolerance (Accuracy Threshold)
    // The bot only reacts if the ball is 100px away from the paddle's center (large margin of error).
    // 💡 To make the bot more accurate, decrease '10' (e.g., change to 5).
    const targetTolerance = 10 * (1.1 - botSkill);
    // 3. Mistake/Freeze Probability
    // This calculates the base chance for the paddle to freeze for one frame.
    const mistakeChance = 0.2 / (botSkill * 0.5 + 0.1);
    // 4. Ball Movement Check
    const ballIsMovingTowardsBot = (ball.dx > 0 && paddle.x > canvas.width / 2) ||
        (ball.dx < 0 && paddle.x < canvas.width / 2);
    // 5. Dead Zone (Reaction Delay)
    // The bot only reacts when the ball passes this boundary (75% of the court).
    // 💡 To make the bot react sooner, decrease '0.6' (e.g., change to 0.5).
    const boundary = canvas.width * 0.6;
    const isBallCloseEnough = (paddle.x > canvas.width / 2)
        ? (ball.x >= boundary) // For the right paddle
        : (ball.x <= canvas.width - boundary); // For the left paddle
    // ----------------------------------------------------------------------
    if (ballIsMovingTowardsBot && isBallCloseEnough) {
        // Mistake Logic: Freeze the paddle based on chance.
        // The division by 10 makes the bot freeze more often, making it easier to score.
        // 💡 To make the bot freeze less often, increase '10' (e.g., change to 60 for 1 freeze/sec max).
        if (Math.random() < mistakeChance / 10) {
            paddle.dy = 0;
        }
        else {
            // Normal Tracking Logic
            if (ball.y < centerOfPaddle - targetTolerance) {
                paddle.dy = -maxSpeed; // Move Up
            }
            else if (ball.y > centerOfPaddle + targetTolerance) {
                paddle.dy = maxSpeed; // Move Down
            }
            else {
                paddle.dy = 0; // Stop (Ball is within the large tolerance range)
            }
        }
    }
    else {
        // Slow movement back towards the center when the ball is far away.
        const centerTarget = canvas.height / 2 - gameConfig.paddleHeight / 2;
        const distanceFromCenter = centerTarget - paddle.y;
        if (Math.abs(distanceFromCenter) > 5) {
            // Movement is 1/10th of the max speed (very slow return).
            paddle.dy = Math.sign(distanceFromCenter) * maxSpeed * 0.1;
        }
        else {
            paddle.dy = 0;
        }
    }
    // Update position and boundary check
    paddle.y += paddle.dy;
    if (paddle.y < 0) {
        paddle.y = 0;
        paddle.dy = 0;
    }
    else if (paddle.y + gameConfig.paddleHeight > canvas.height) {
        paddle.y = canvas.height - gameConfig.paddleHeight;
        paddle.dy = 0;
    }
}
// Better AI version but never loses :P
// export function updateBotPaddle(
//   paddle: Paddle, 
//   ball: Ball, 
//   canvas: HTMLCanvasElement, 
//   gameConfig: GameConfig, 
//   botSkill: number = 0.5
// ) {
//   const maxSpeed = gameConfig.ballInitSpeed * botSkill; 
//   const centerOfPaddle = paddle.y + gameConfig.paddleHeight / 2;
//   const targetTolerance = 60 * (1.1 - botSkill); 
//   const mistakeChance = 0.2 / (botSkill * botSkill + 0.1); 
//   const ballIsMovingTowardsBot = (ball.dx > 0 && paddle.x > canvas.width / 2) || 
//                                  (ball.dx < 0 && paddle.x < canvas.width / 2);
//   const isBallCloseEnough = (paddle.x > canvas.width / 2) 
//     ? (ball.x >= canvas.width * 0.75) 
//     : (ball.x <= canvas.width - (canvas.width * 0.75));
//   if (ballIsMovingTowardsBot && isBallCloseEnough) {
//       if (Math.random() < mistakeChance / 20) { 
//           paddle.dy = 0; 
//       } else {
//           if (ball.y < centerOfPaddle - targetTolerance) {
//               paddle.dy = -maxSpeed; 
//           } else if (ball.y > centerOfPaddle + targetTolerance) {
//               paddle.dy = maxSpeed; 
//           } else {
//               paddle.dy = 0;
//           }
//       }
//   } else {
//       const centerTarget = canvas.height / 2 - gameConfig.paddleHeight / 2;
//       const distanceFromCenter = centerTarget - paddle.y;
//       if (Math.abs(distanceFromCenter) > 5) {
//           paddle.dy = Math.sign(distanceFromCenter) * maxSpeed * 0.2; 
//       } else {
//           paddle.dy = 0;
//       }
//   }
//   paddle.y += paddle.dy;
//   if (paddle.y < 0) {
//     paddle.y = 0;
//     paddle.dy = 0; 
//   } else if (paddle.y + gameConfig.paddleHeight > canvas.height) {
//     paddle.y = canvas.height - gameConfig.paddleHeight;
//     paddle.dy = 0; 
//   }
// }
