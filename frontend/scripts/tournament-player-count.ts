import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";
import { addAliasesSection } from "./tournament-player-aliases.js";
import { resetTournamentSettings } from "./pong.js";
// Προσθήκη των απαραίτητων imports για το στυλ
import { toggleOpacity, showMessage } from "./settings-page.js";
import { updatePassMsgDot } from "./profile-page.js";

export function handleNextAfterCount(event?: MouseEvent): void {
	const playerCountEl = document.querySelector('#player-count-input') as HTMLInputElement | null;
  
  // Στοχεύουμε τα στοιχεία ακριβώς όπως στο Sign-up
  const statusContainer = document.querySelector('.js-alias-status') as HTMLElement | null;
  const statusText = document.querySelector('.js-alias-status-text') as HTMLElement | null;
  const statusDot = document.querySelector('.js-alias-text-dot') as HTMLElement | null;

  if (!playerCountEl) return;

  const humanPlayersCount = Number(playerCountEl.value);

  // Validation με το στυλ του Sign-up
  if (isNaN(humanPlayersCount) || humanPlayersCount < 2 || humanPlayersCount > 100) {
    updatePassMsgDot('red', statusDot); // Από το profile-page.js
    showMessage(statusText, "Please enter a number between 2 and 100."); // Από το settings-page.js
    toggleOpacity(statusContainer); // Από το settings-page.js
    return;
  }
  
	// 3. Αν όλα είναι OK, συνεχίζουμε στη λογική του τουρνουά
	resetTournamentSettings();
  
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