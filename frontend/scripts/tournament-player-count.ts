import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";
import { addAliasesSection } from "./tournament-player-aliases.js";
import { resetTournamentSettings } from "./pong.js";

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

export function handleNextAfterCount(event?: MouseEvent): void {

  

  const playerCountEl = document.querySelector('#player-count-input') as HTMLInputElement | null;

  if (!playerCountEl || !playerCountEl.checkValidity()) {
    return;
  }

  resetTournamentSettings();

  const humanPlayersCount = Number(playerCountEl.value);
  const exponent = Math.log2(humanPlayersCount);
  const nextExponent = Math.ceil(exponent);
  const totalRequiredPlayers = Math.pow(2, nextExponent);
  const numberOfBots = totalRequiredPlayers - humanPlayersCount;
  
  tSettings.numberOfBots = numberOfBots; 
  tSettings.numberOfPlayers = totalRequiredPlayers;

  const loggedInUser = localStorage.getItem('userName') || 'Player 1';

  const humanAliases: string[] = [loggedInUser];
  for (let i = 1; i < humanPlayersCount; i++) {
    humanAliases.push(""); 
  }

  const botAliases: string[] = [];
  for (let i = 1; i <= numberOfBots; i++) {
    botAliases.push(`Bot ${i}`);
  }

  tSettings.playerAliases = [...humanAliases, ...botAliases];

  addAliasesSection();
}