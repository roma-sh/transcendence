import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";
import { addAliasesSection } from "./tournament-player-aliases.js";
import { resetTournamentSettings } from "./pong.js";
import { toggleOpacity, showMessage } from "./settings-page.js";
import { updatePassMsgDot } from "./profile-page.js";

export function handleNextAfterCount(event?: MouseEvent): void {
	const playerCountEl = document.querySelector('#player-count-input') as HTMLInputElement | null;
  const statusContainer = document.querySelector('.js-alias-status') as HTMLElement | null;
  const statusText = document.querySelector('.js-alias-status-text') as HTMLElement | null;
  const statusDot = document.querySelector('.js-alias-text-dot') as HTMLElement | null;

  if (!playerCountEl) return;

  const humanPlayersCount = Number(playerCountEl.value);

  if (isNaN(humanPlayersCount) || humanPlayersCount < 2 || humanPlayersCount > 100) {
    updatePassMsgDot('red', statusDot); 
    showMessage(statusText, "Please enter a number between 2 and 100."); 
    toggleOpacity(statusContainer); 
    return;
  }
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