import { TournamentSettings } from "./types";

/**
 * Registers a click event listener on the "Next" button of the player count screen.
 * When the button is clicked and the input is valid, it calculates the total players 
 * required for a power-of-two bracket, determines the number of bots needed, 
 * updates the tSettings object, and calls the provided callback function.
 *
 * @param tSettings - The current tournament settings object (will be updated).
 * @param callback - The function to call after calculating and updating the player count.
 */

function generateBotAliases(tSettings: TournamentSettings) {
  const botAliases: string[] = [];
  
  for (let i = 1; i <= tSettings.numberOfBots; i++) {
    botAliases.push(`Bot ${i}`);
  }

  return botAliases;
}


export function registerNextClickAfterCount(
  tSettings: TournamentSettings,
  callback: (tSettings: TournamentSettings) => void) {
  
  const nextEl = document.querySelector('.js-next-btn-after-count');

  if (!nextEl) return;

  nextEl.addEventListener('click', () => {
    const playerCountEl
      = document.querySelector('#player-count-input') as HTMLInputElement | null;

    if (playerCountEl && playerCountEl.checkValidity()) {
      const humanPlayers = Number(playerCountEl.value);
      const exponent = Math.log2(humanPlayers);
      const nextExponent = Math.ceil(exponent);
      const totalRequiredPlayers = Math.pow(2, nextExponent);
      const numberOfBots = totalRequiredPlayers - humanPlayers;
      
      tSettings.numberOfBots = numberOfBots; 
      tSettings.numberOfPlayers = totalRequiredPlayers;
      
      const botAliases = generateBotAliases(tSettings); 
      tSettings.playerAliases = tSettings.playerAliases.concat(botAliases);

      callback(tSettings);
    }
  });
}