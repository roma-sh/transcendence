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
  location.hash = 'tournament-page-player-aliases';
  generateInputsForAliases(tSettings);
  registerNextClickAfterAliases(tSettings);
}
