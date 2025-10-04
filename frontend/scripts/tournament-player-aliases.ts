import { TournamentSettings } from "./types.js";
import { game } from './game.js'; 

export function generateInputsForAliases(
  tSettings: TournamentSettings
) {
  let html = '';
  for (let i = 0; i < tSettings.numberOfPlayers; ++i) {
    html += `
      <div>
        <div class="player-photo"></div>
        <input type="text" name="playerAlias" class="player-alias-input
            js-player-alias-input"
          placeholder="Player ${i + 1}">
      </div>
    `;
  }
  const aliaseInputEl = document.querySelector('.aliase-inputs');

  if (aliaseInputEl) aliaseInputEl.innerHTML = html;
}

async function checkAliasExists(alias: string): Promise<boolean> {
  const response = await fetch(`http://localhost:3000/api/checkAlias/${alias}`);
  const data = await response.json();
  return data.exists;
}

let currentTSettings: TournamentSettings | null = null; 

async function permanentClickHandler(e: Event) {
    // Χρησιμοποιούμε τα tSettings που έχουν αποθηκευτεί τελευταία
    if (!currentTSettings) return; 

    e.preventDefault();

    const inputsList = document.querySelectorAll('.js-player-alias-input');
    const aliases = Array.from(inputsList).map((input) => (input as HTMLInputElement).value.trim());

    // Έλεγχος για κενά πεδία
    if (aliases.some(alias => !alias)) {
      alert("Please fill in all fields.");
      return;
    }

    const aliasesExist = [];
    const aliasesDoNotExist = [];

    // Έλεγχος ύπαρξης Aliases
    for (const alias of aliases) {
      const exists = await checkAliasExists(alias);
      if (exists) {
        aliasesExist.push(alias);
      } else {
        aliasesDoNotExist.push(alias);
      }
    }

    // Εμφάνιση αποτελεσμάτων & Ολοκλήρωση
    if (aliasesDoNotExist.length > 0) {
      alert(`Unfortunately, user(s) "${aliasesDoNotExist.join(', ')}" were not found in our database. Please sign up first.`);
    }

    if (aliasesExist.length > 0) {
    //   alert(`Users "${aliasesExist.join(', ')}" were found in our database. You can proceed.`);
      
      if (aliasesDoNotExist.length === 0) {
        // Αποθηκεύουμε τα aliases στα currentTSettings
        currentTSettings.playerAliases = aliasesExist; 
        console.log("All players are registered:", currentTSettings.playerAliases);
		// game(aliasesExist[0], aliasesExist[1]);
        location.hash = '#game-ready-page';
      }
    }
}

export function registerNextClickAfterAliases(
  tSettings: TournamentSettings
) {
  const btnEl = document.querySelector('.js-next-btn-after-aliases');

  if (!btnEl) return;

  // 2. ΕΝΗΜΕΡΩΝΟΥΜΕ ΤΑ SETTINGS: Κάθε φορά που καλείται η συνάρτηση,
  // απλά ενημερώνουμε την καθολική αναφορά (currentTSettings)
  currentTSettings = tSettings;

  // 3. Προσθέτουμε τον listener ΜΟΝΟ ΑΝ ΔΕΝ ΥΠΑΡΧΕΙ
  // Σημείωση: Δεν χρειάζεται removeEventListener γιατί χρησιμοποιούμε
  // την ίδια συνάρτηση-αναφορά (permanentClickHandler) κάθε φορά.

  // Αυτό είναι ένα 'hack' για να δεις αν έχει προστεθεί
  if (!btnEl.hasAttribute('data-listener-registered')) {
      btnEl.addEventListener('click', permanentClickHandler);
      // Χρησιμοποιούμε ένα data attribute για να θυμόμαστε ότι έγινε η καταχώρηση
      btnEl.setAttribute('data-listener-registered', 'true');
      console.log('Listener registered for the first time.');
  } else {
      console.log('Listener already registered. Settings updated.');
  }
}