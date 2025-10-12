import { generateInputsForAliases, registerNextClickAfterAliases } from "./tournament-player-aliases.js";
import { registerNextClickAfterCount } from "./tournament-player-count.js";
export function tournament(tSettings) {
    registerNextClickAfterCount(tSettings, addAliasesSection);
}
export function addAliasesSection(tSettings) {
    console.log("--- STARTING ALIASES SECTION ---");
    console.log("Number of Players received in addAliasesSection:", tSettings.numberOfPlayers);
    location.hash = 'tournament-page-player-aliases';
    registerNextClickAfterAliases(tSettings);
    generateInputsForAliases(tSettings);
}
