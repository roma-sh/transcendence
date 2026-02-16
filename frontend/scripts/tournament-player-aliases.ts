import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";

export function handleGoBackPlayerAliases() {
  location.hash = '#tournament-page';
}

export function addAliasesSection() {

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

function generateInputsForAliases(tSettings: TournamentSettings) {
  let html = '';
  const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
  let botCounter = 1; 

  const loggedInUser = localStorage.getItem('userName') || '';

  for (let i = 0; i < tSettings.numberOfPlayers; ++i) {
    const isBotInput = i >= humanPlayersCount;

    let inputValue = '';
    let disabledAttribute = '';
    let inputClass = 'player-alias-input js-player-alias-input';
    
    inputClass += `
      rounded-[5px] border-2 border-solid
      border-(--border-color) w-[270px] pl-[10px]
      py-[15px] text-[18px] text-(--main-color)
      mb-[10px] bg-(--bg-color-white-seven)
      placeholder:text-(--main-color) placeholder:text-[18px]
    `;

    if (isBotInput) {
      inputValue = `Bot ${botCounter}`;
      botCounter++; 
      disabledAttribute = 'disabled';
      inputClass += ' bot-alias-input opacity-70 cursor-not-allowed';
    } else {
      // HUMAN LOGIC
      if (i === 0) {
        // ΚΛΕΙΔΩΜΑ Player 1: Βάζουμε το όνομα ΚΑΙ το κάνουμε disabled
        inputValue = tSettings.playerAliases[i] || loggedInUser;
        disabledAttribute = 'disabled'; // Αυτή η γραμμή το κλειδώνει
        inputClass += ' opacity-80 cursor-not-allowed bg-gray-100'; // Οπτική ένδειξη ότι είναι κλειδωμένο
      } else {
        inputValue = tSettings.playerAliases[i] || '';
      }
    }

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

  return html;
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

  // Validate: no duplicates
  const lower = humanAliases.map(a => a.toLowerCase());
  const hasDup = new Set(lower).size !== lower.length;
  if (hasDup) {
    alert("Player aliases must be unique.");
    return;
  }

  if (humanAliases.length > 0 || tSettings.numberOfBots > 0) {
      
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
        ...humanAliases,       // Confirmed humans
        ...createdBotAliases   // Generated Bots
    ];

    tSettings.playerAliases = finalTournamentAliases; 

    location.hash = '#game-ready-page';
  }
}
