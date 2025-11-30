import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";

export function handleGoBackPlayerAliases() {
  location.hash = '#tournament-page';
}

export function addAliasesSection() {

  console.log("--- STARTING ALIASES SECTION ---");
  console.log("Number of Players received in addAliasesSection:", tSettings.numberOfPlayers);

  location.hash = '#tournament-page-player-aliases';

  const inputsContainer = document.querySelector('.aliase-inputs');

  if (!inputsContainer) return; 

  // ******************************************************
  // 1. FIX: Clearing Aliases 
  // We must remove Bot aliases or any old strings
  // before creating the inputs.
  const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;

  // We ensure that the tSettings.playerAliases list contains ONLY
  // the human aliases (or is empty).
  // We use slice to keep only the first N players,
  // who must be the humans.
  if (tSettings.playerAliases.length > 0) {
      tSettings.playerAliases = tSettings.playerAliases.slice(0, humanPlayersCount);
  }

  // ******************************************************

  // 3. GENERATE/ASSIGN HTML (Restore fields)
  // Now generateInputsForAliases will use the correct, cleaned list.
  const aliasesHtml = generateInputsForAliases(tSettings);
  inputsContainer.innerHTML = aliasesHtml;
}

// --- 1. Helper Function: Create HTML Inputs ---
function generateInputsForAliases( tSettings: TournamentSettings) {
  let html = '';

  // Calculate the index from which Bots start
  const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;

  // Counter for correct Bot numbering (starts at 1)
  let botCounter = 1; 

  for (let i = 0; i < tSettings.numberOfPlayers; ++i) {

    // Check if the current index (i) corresponds to a Bot
    const isBotInput = i >= humanPlayersCount;

    let inputValue = '';
    let disabledAttribute = '';
    let inputClass = 'player-alias-input js-player-alias-input';

    if (isBotInput) {
      // Bot Logic: Correct naming (Bot 1, Bot 2, etc.)
      inputValue = `Bot ${botCounter}`;
      botCounter++; 
      disabledAttribute = 'disabled';
      inputClass += ' bot-alias-input';
    } else {
        // Human Logic: Empty value so the placeholder is visible
        // and the user can enter the alias
        // inputValue = tSettings.playerAliases[i] || ''; // We use an empty string
        inputValue = '';
    }

    // Create the HTML for the input
    html += `
      <div>
        <div class="player-photo"></div>
        <input type="text" 
          name="playerAlias" 
          class="${inputClass}"
          placeholder="Player ${i + 1}"
          value="${inputValue}" 
          ${disabledAttribute}> 
      </div>
    `;
  }

  // REMOVE DOM ASSIGNMENT FROM HERE
  // The assignment will be done by the function that calls generateInputsForAliases
  // (e.g., initTournamentPlayerAliasesPage).
  return html; // We return only the HTML string
}

// --- 2. Helper Function: Alias Check ---
async function checkAliasExists(alias: string): Promise<boolean> {
  const response = await fetch(`http://127.0.0.1:3000/api/checkAlias/${alias}`);
  const data = await response.json();
  return data.exists;
}

// --- 3. Handler for the NEXT Button ---
export async function handleNextAfterAliases() {

  const inputsList = document.querySelectorAll('.js-player-alias-input');

  // Exclude Bot aliases from validation
  const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;

  // We only get the aliases of the human players (the first humanPlayersCount inputs)
  const humanAliases = Array.from(inputsList)
      .slice(0, humanPlayersCount)
      .map((input) => (input as HTMLInputElement).value.trim());

  // Check for empty fields
  if (humanAliases.some(alias => !alias)) {
    alert("Please fill in all player fields.");
    return;
  }

  const aliasesExist: string[] = [];
  const aliasesDoNotExist: string[] = [];

  // Check if Aliases exist
  for (const alias of humanAliases) {
    const exists = await checkAliasExists(alias); 
    if (exists) {
      aliasesExist.push(alias);
    } else {
      aliasesDoNotExist.push(alias);
    }
  }

  // Result handling
  if (aliasesDoNotExist.length > 0) {
    alert(`Unfortunately, user(s) "${aliasesDoNotExist.join(', ')}" were not found in our database. Please sign up first.`);
    return; // We stop if there are invalid aliases
  }

  // If we reach here, all human aliases are valid
  if (aliasesExist.length > 0 || tSettings.numberOfBots > 0) {
      
    // *****************************************************************
    // ** Dynamically Create Bot Aliases **
    // *****************************************************************
    const createdBotAliases: string[] = [];
    const totalBots = tSettings.numberOfBots;

    for (let i = 0; i < totalBots; i++) {
        createdBotAliases.push(`Bot ${i + 1}`); 
    }

    // 6. COMBINATION of Human Players and Bots
    const finalTournamentAliases: string[] = [
        ...aliasesExist,       // Confirmed humans
        ...createdBotAliases   // Generated Bots
    ];

    tSettings.playerAliases = finalTournamentAliases; 

    console.log("--- FINAL TOURNAMENT ALIASES ---");
    console.log("All players are registered (Humans + Bots):", tSettings.playerAliases);
    console.log("Total Players:", tSettings.playerAliases.length);
    console.log("---------------------------------");

    location.hash = '#game-ready-page';
  }
}
