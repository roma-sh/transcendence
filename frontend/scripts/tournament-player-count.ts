import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";
import { addAliasesSection } from "./tournament-player-aliases.js";

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

// export function handleNextAfterCount(event?: MouseEvent): void {
//   const playerCountEl
//       = document.querySelector('#player-count-input') as HTMLInputElement | null;

//   if (!playerCountEl || !playerCountEl.checkValidity()) {
//     return;
//   }

//   const humanPlayers = Number(playerCountEl.value);
//   const exponent = Math.log2(humanPlayers);
//   const nextExponent = Math.ceil(exponent);
//   const totalRequiredPlayers = Math.pow(2, nextExponent);
//   const numberOfBots = totalRequiredPlayers - humanPlayers;
  
//   tSettings.numberOfBots = numberOfBots; 
//   tSettings.numberOfPlayers = totalRequiredPlayers;
  
//   const botAliases = generateBotAliases(tSettings); 
//   tSettings.playerAliases = tSettings.playerAliases.concat(botAliases);

//   addAliasesSection();
// }

export function handleNextAfterCount(event?: MouseEvent): void {
  const playerCountEl = document.querySelector('#player-count-input') as HTMLInputElement | null;

  if (!playerCountEl || !playerCountEl.checkValidity()) {
    return;
  }

  // 1. Βασικοί υπολογισμοί για Power of 2
  const humanPlayersCount = Number(playerCountEl.value);
  const exponent = Math.log2(humanPlayersCount);
  const nextExponent = Math.ceil(exponent);
  const totalRequiredPlayers = Math.pow(2, nextExponent);
  const numberOfBots = totalRequiredPlayers - humanPlayersCount;
  
  // 2. Ενημέρωση των settings
  tSettings.numberOfBots = numberOfBots; 
  tSettings.numberOfPlayers = totalRequiredPlayers;

  // 3. Δημιουργία της λίστας Aliases από το μηδέν
  // Παίρνουμε το όνομα του συνδεδεμένου χρήστη
  const loggedInUser = localStorage.getItem('userName') || 'Player 1';

  // Φτιάχνουμε τη λίστα των ανθρώπων (Πρώτος ο User, οι άλλοι κενοί)
  const humanAliases: string[] = [loggedInUser];
  for (let i = 1; i < humanPlayersCount; i++) {
    humanAliases.push(""); 
  }

  // Δημιουργούμε τα Bot aliases
  const botAliases: string[] = [];
  for (let i = 1; i <= numberOfBots; i++) {
    botAliases.push(`Bot ${i}`);
  }

  // 4. Ανάθεση της τελικής λίστας (Humans first, then Bots)
  tSettings.playerAliases = [...humanAliases, ...botAliases];

  // 5. Μετάβαση στην επόμενη σελίδα
  addAliasesSection();
}