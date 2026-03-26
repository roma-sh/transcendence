import { Paddle, Ball, GameConfig } from "./types.js";

export function updateBotPaddle(
  paddle: Paddle, 
  ball: Ball, 
  canvas: HTMLCanvasElement, 
  gameConfig: GameConfig, 
  botSkill: number = 0.5
) {
  
  // 20% of the speed of the ball
  const maxSpeed = gameConfig.ballInitSpeed * 0.2 * botSkill;
  const centerOfPaddle = paddle.y + gameConfig.paddleHeight / 2;
  
  // Target Tolerance (Accuracy Threshold)
  // The bot only reacts if the ball is 60px away from the paddle's center (large margin of error).
  // 💡 To make the bot more accurate, decrease the number (if instead of 10 put 5, the bot will try more to fins the ball in the center of the paddle).
  const targetTolerance = 10 * (1.1 - botSkill);
  
  // Mistake/Freeze Probability
  // This calculates the base chance for the paddle to freeze for one frame.
  // The bigger the botSkill, the less the freeze
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
  
    if (paddle.freezeTimer > 0) {
      paddle.freezeTimer -= 1;
      paddle.dy = 0; 
      return; 
  }

  if (ballIsMovingTowardsBot && isBallCloseEnough) {
      
      // Mistake Logic: Freeze the paddle based on chance.
      // The division by 10 makes the bot freeze more often, making it easier to score.
      // 💡 To make the bot freeze less often, increase '10' (e.g., change to 60 for 1 freeze/sec max).
      if (Math.random() < mistakeChance / 500) { 
        //   paddle.dy = 0; 
          paddle.freezeTimer = 20;
          paddle.dy = 0;
          return;
      } else {
          // Normal Tracking Logic
          if (ball.y < centerOfPaddle - targetTolerance) {
              paddle.dy = -maxSpeed; // Move Up
          } else if (ball.y > centerOfPaddle + targetTolerance) {
              paddle.dy = maxSpeed; // Move Down
          } else {
              paddle.dy = 0; // Stop (Ball is within the large tolerance range)
          }
      }
      
  } else {
      // Slow movement back towards the center when the ball is far away.
      const centerTarget = canvas.height / 2 - gameConfig.paddleHeight / 2;
      const distanceFromCenter = centerTarget - paddle.y;
      
      if (Math.abs(distanceFromCenter) > 5) {
          // Movement is 1/10th of the max speed (very slow return).
          paddle.dy = Math.sign(distanceFromCenter) * maxSpeed * 0.1; 
      } else {
          paddle.dy = 0;
      }
  }

  // Update position and boundary check
  paddle.y += paddle.dy;
  if (paddle.y < 0) {
    paddle.y = 0;
    paddle.dy = 0; 
  } else if (paddle.y + gameConfig.paddleHeight > canvas.height) {
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

