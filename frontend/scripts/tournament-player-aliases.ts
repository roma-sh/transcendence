import { TournamentSettings } from "./types.js";
import { tSettings } from "./pong.js";
import { toggleOpacity, showMessage } from "./settings-page.js";
import { updatePassMsgDot } from "./profile-page.js";

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
	let inputClass = 'player-alias-input js-player-alias-input ';

	inputClass += `
	rounded-[15px] border border-gray-300 w-[300px] 
	px-[20px] py-[25px] text-[24px] text-center
	mb-[15px] bg-[#f0eeee] focus:outline-none
	`;
    // let inputClass = 'player-alias-input js-player-alias-input';
    
    // inputClass += `
    //   rounded-[5px] border-2 border-solid
    //   border-(--border-color) w-[270px] pl-[10px]
    //   py-[15px] text-[18px] text-(--main-color)
    //   mb-[10px] bg-(--bg-color-white-seven)
    //   placeholder:text-(--main-color) placeholder:text-[18px]
    // `;

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

// export async function handleNextAfterAliases() {
// 	const inputsList = document.querySelectorAll('.js-player-alias-input');
// 	const errorContainer = document.querySelector('.js-error-message') as HTMLElement | null;
  
// 	// Καθαρισμός προηγούμενου μηνύματος
// 	if (errorContainer) {
// 	  errorContainer.textContent = "";
// 	  errorContainer.classList.add('hidden');
// 	}
  
// 	const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
// 	const humanAliases = Array.from(inputsList)
// 		.slice(0, humanPlayersCount)
// 		.map((input) => (input as HTMLInputElement).value.trim());
  
// 	// 1. Έλεγχος για κενά πεδία
// 	if (humanAliases.some(alias => !alias)) {
// 	  showErrorMessage("Please fill in all player fields.", errorContainer);
// 	  return;
// 	}
  
// 	// 2. Έλεγχος για διπλότυπα
// 	const lower = humanAliases.map(a => a.toLowerCase());
// 	const hasDup = new Set(lower).size !== lower.length;
// 	if (hasDup) {
// 	  showErrorMessage("Player aliases must be unique.", errorContainer);
// 	  return;
// 	}
  
// 	// 3. Αν όλα είναι οκ, προχωράμε
// 	if (humanAliases.length > 0 || tSettings.numberOfBots > 0) {
// 	  const createdBotAliases: string[] = [];
// 	  const totalBots = tSettings.numberOfBots;
  
// 	  for (let i = 0; i < totalBots; i++) {
// 		  createdBotAliases.push(`Bot ${i + 1}`); 
// 	  }
  
// 	  const finalTournamentAliases = [...humanAliases, ...createdBotAliases];
// 	  tSettings.playerAliases = finalTournamentAliases; 
  
// 	  location.hash = '#game-ready-page';
// 	}
//   }
  
//   // Helper function για την εμφάνιση του μηνύματος
//   function showErrorMessage(message: string, container: HTMLElement | null) {
// 	if (container) {
// 	  container.textContent = message;
// 	  container.classList.remove('hidden');
// 	  container.style.color = "rgb(239, 68, 68)"; // Κόκκινο χρώμα (Tailwind red-500)
// 	  container.style.marginTop = "10px";
// 	}
//   }

export async function handleNextAfterAliases() {
    const inputsList = document.querySelectorAll('.js-player-alias-input');
    
    // 1. Πρώτα βρίσκουμε το συγκεκριμένο section της σελίδας Aliases
    const section = document.querySelector('#tournament-page-player-aliases');
    
    // 2. Ψάχνουμε τα status στοιχεία ΜΟΝΟ μέσα σε αυτό το section
    const statusContainer = section?.querySelector('.js-alias-status') as HTMLElement | null;
    const statusText = section?.querySelector('.js-alias-status-text') as HTMLElement | null;
    const statusDot = section?.querySelector('.js-alias-text-dot') as HTMLElement | null;

    // Reset του opacity (όπως και πριν)
    if (statusContainer) {
        statusContainer.classList.remove('opacity-100');
        statusContainer.classList.add('opacity-0');
    }

    const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
    const humanAliases = Array.from(inputsList)
        .slice(0, humanPlayersCount)
        .map((input) => (input as HTMLInputElement).value.trim());

    // Έλεγχος για κενά
    if (humanAliases.some(alias => !alias)) {
        displayError("Please fill in all player fields.", statusContainer, statusText, statusDot);
        return;
    }

    // Έλεγχος για διπλότυπα
    const lower = humanAliases.map(a => a.toLowerCase());
    const hasDup = new Set(lower).size !== lower.length;
    if (hasDup) {
        displayError("Player aliases must be unique.", statusContainer, statusText, statusDot);
        return;
    }

    // Αν είναι OK, προχωράμε
    if (humanAliases.length > 0 || tSettings.numberOfBots > 0) {
        const createdBotAliases = [];
        for (let i = 0; i < tSettings.numberOfBots; i++) {
            createdBotAliases.push(`Bot ${i + 1}`); 
        }
        tSettings.playerAliases = [...humanAliases, ...createdBotAliases]; 
        location.hash = '#game-ready-page';
    }
}

function displayError(msg: string, container: HTMLElement | null, textEl: HTMLElement | null, dotEl: HTMLElement | null) {
    if (!container || !textEl || !dotEl) {
        console.error("Missing error elements in Aliases page");
        return;
    }

    // 1. Καθαρισμός κειμένου και χρώματος
    updatePassMsgDot('red', dotEl);
    showMessage(textEl, msg);
    
    // 2. Εξαναγκασμένο Reset του opacity
    container.style.transition = 'none'; // Κλείνουμε στιγμιαία το transition
    container.classList.remove('opacity-100');
    container.classList.add('opacity-0');

    // 3. Trigger του animation
    // Το διπλό requestAnimationFrame είναι το "μαγικό" κόλπο για να καταλάβει 
    // ο browser ότι πρέπει να ξαναξεκινήσει το animation από το μηδέν.
    requestAnimationFrame(() => {
        container.style.transition = ''; // Επαναφέρουμε το transition
        requestAnimationFrame(() => {
            toggleOpacity(container);
        });
    });
}
