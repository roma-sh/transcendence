import {
  generateInputsForAliases,
  registerNextClickAfterAliases
} from "./tournament-player-aliases.js";
import {
  registerNextClickAfterCount
} from "./tournament-player-count.js";
import { TournamentSettings } from "./types.js";

export function tournament(tSettings: TournamentSettings) {
  registerNextClickAfterCount(tSettings, addAliasesSection);
}

export function addAliasesSection(tSettings: TournamentSettings) {

  console.log("--- STARTING ALIASES SECTION ---");
  console.log("Number of Players received in addAliasesSection:", tSettings.numberOfPlayers);
  
  location.hash = 'tournament-page-player-aliases';
  registerNextClickAfterAliases(tSettings);
  generateInputsForAliases(tSettings);
}
