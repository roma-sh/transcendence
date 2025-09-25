import { TournamentSettings } from "./types.js";

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
          placeholder="Player ${i+1}">
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

export function registerNextClickAfterAliases(
  tSettings: TournamentSettings
) {
  const btnEl = document.querySelector('.js-next-btn-after-aliases');

  if (!btnEl) return;

  btnEl.addEventListener('click', async (e) => {
    e.preventDefault();

    const inputsList = document.querySelectorAll('.js-player-alias-input');
    const aliases = Array.from(inputsList).map((input) => (input as HTMLInputElement).value.trim());

    // Πρώτα, ελέγχουμε αν κάποιο πεδίο είναι κενό.
    if (aliases.some(alias => !alias)) {
      alert("Παρακαλώ συμπληρώστε όλα τα πεδία.");
      return;
    }

    const aliasesExist = [];
    const aliasesDoNotExist = [];

    // Έλεγχος για κάθε ψευδώνυμο
    for (const alias of aliases) {
      const exists = await checkAliasExists(alias);
      if (exists) {
        aliasesExist.push(alias);
      } else {
        aliasesDoNotExist.push(alias);
      }
    }

    // Εμφάνιση των τελικών αποτελεσμάτων
    if (aliasesDoNotExist.length > 0) {
      alert(`Δυστυχώς, ο χρήστης(ες) "${aliasesDoNotExist.join(', ')}" δεν βρέθηκε(αν) στη βάση μας. Παρακαλώ εγγραφείτε πρώτα.`);
    }

    if (aliasesExist.length > 0) {
      alert(`Οι χρήστες "${aliasesExist.join(', ')}" βρέθηκαν στη βάση μας. Μπορείτε να συνεχίσετε.`);
      
      // Αν όλοι οι παίκτες υπάρχουν, αποθηκεύουμε τα ψευδώνυμα
      if (aliasesDoNotExist.length === 0) {
        tSettings.playerAliases = aliasesExist;
        console.log("Όλοι οι παίκτες είναι εγγεγραμμένοι:", tSettings.playerAliases);
        // Εδώ μπορείς να αλλάξεις σελίδα.
        // location.hash = '#next-page';
      }
    }
  });
}