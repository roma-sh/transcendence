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

  const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
  if (tSettings.playerAliases.length > 0) {
      tSettings.playerAliases = tSettings.playerAliases.slice(0, humanPlayersCount);
  }
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

    if (isBotInput) {
      inputValue = `Bot ${botCounter}`;
      botCounter++; 
      disabledAttribute = 'disabled';
      inputClass += ' bot-alias-input opacity-70 cursor-not-allowed';
    } else {
      if (i === 0) {
        inputValue = tSettings.playerAliases[i] || loggedInUser;
        disabledAttribute = 'disabled'; 
        inputClass += ' opacity-80 cursor-not-allowed bg-gray-100'; 
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

export async function handleNextAfterAliases() {
    const inputsList = document.querySelectorAll('.js-player-alias-input');
    
    const section = document.querySelector('#tournament-page-player-aliases');
    
    const statusContainer = section?.querySelector('.js-alias-status') as HTMLElement | null;
    const statusText = section?.querySelector('.js-alias-status-text') as HTMLElement | null;
    const statusDot = section?.querySelector('.js-alias-text-dot') as HTMLElement | null;

    if (statusContainer) {
        statusContainer.classList.remove('opacity-100');
        statusContainer.classList.add('opacity-0');
    }

    const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
    const humanAliases = Array.from(inputsList)
        .slice(0, humanPlayersCount)
        .map((input) => (input as HTMLInputElement).value.trim());

    if (humanAliases.some(alias => !alias)) {
        displayError("Please fill in all player fields.", statusContainer, statusText, statusDot);
        return;
    }

    const lower = humanAliases.map(a => a.toLowerCase());
    const hasDup = new Set(lower).size !== lower.length;
    if (hasDup) {
        displayError("Player aliases must be unique.", statusContainer, statusText, statusDot);
        return;
    }

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

    updatePassMsgDot('red', dotEl);
    showMessage(textEl, msg);
    
    container.style.transition = 'none'; 
    container.classList.remove('opacity-100');
    container.classList.add('opacity-0');

    requestAnimationFrame(() => {
        container.style.transition = '';
        requestAnimationFrame(() => {
            toggleOpacity(container);
        });
    });
}
