import { tSettings } from "./pong.js";

export function handleGoBackGameReadyPage() {
  location.hash = '#tournament-page-player-aliases';
}

// export function initGameReadyPage() {

//   if (tSettings.playerAliases.length == 0) {
//     if (tSettings.winnersAliases.length == 1) {
//       tSettings.playerAliases = [];
//       tSettings.secondPlaceAlias = tSettings.secondPlaceAliases.pop()!;
//       tSettings.firstPlaceAlias = tSettings.winnersAliases.pop()!;
//       tSettings.winnersAliases = [];
//       tSettings.secondPlaceAliases = [];
//       location.hash = `#winner-page`;
//       return;
//     }

//     tSettings.playerAliases = tSettings.winnersAliases.slice(); // Copy winners to the next round
//     tSettings.winnersAliases = []; // Clear winners for the next round
//   }

//   // 1. Extract the First Player (Start of the list)
//   // shift() removes and returns the first element.
//   const p1Name = tSettings.playerAliases.shift(); 

//   // 2. Extract the Last Player (End of the list)
//   // pop() removes and returns the last element.
//   const p2Name = tSettings.playerAliases.pop();

//   if (p1Name && p2Name)
//     tSettings.currentMatch = { p1Name, p2Name };
//   else
//     tSettings.currentMatch = null;

//   // 3. Inject Names into the DOM
//   const p1NameEl = document.querySelector('.js-p1-name');
//   const p2NameEl = document.querySelector('.js-p2-name');

//   if (p1NameEl) {
//     p1NameEl.textContent = p1Name || '';
//   }
//   if (p2NameEl) {
//     p2NameEl.textContent = p2Name || '';
//   }
// }

// export function handleStartTournament() {

//   if (!tSettings.currentMatch) {
//     console.error('Missing player names for game start');
//     return;
//   }

//   location.hash = '#game-page';
// }


export function initGameReadyPage() {
  // ΕΛΕΓΧΟΣ: Αν η λίστα των παικτών άδειασε, σημαίνει ότι τελείωσε ο γύρος
  if (tSettings.playerAliases.length === 0) {
    
    // ΠΕΡΙΠΤΩΣΗ 1: ΤΕΛΙΚΟΣ (Έχουμε μόνο 1 νικητή και παίζαμε τελικό - 2 παίκτες)
    // Ελέγχουμε αν οι νικητές είναι 1 ΚΑΙ αν ο προηγούμενος γύρος είχε μόνο 2 άτομα
    if (tSettings.winnersAliases.length === 1 && tSettings.numberOfPlayers === 2) {
      tSettings.firstPlaceAlias = tSettings.winnersAliases.pop()!;
      tSettings.secondPlaceAlias = tSettings.secondPlaceAliases.pop() || "";
      
      // Καθαρισμός για ασφάλεια
      tSettings.playerAliases = [];
      tSettings.winnersAliases = [];
      tSettings.secondPlaceAliases = [];
      
      location.hash = `#winner-page`;
      return;
    }

    // ΠΕΡΙΠΤΩΣΗ 2: ΑΛΛΑΓΗ ΓΥΡΟΥ (Τελείωσαν οι αγώνες του γύρου, πάμε στους νικητές)
    if (tSettings.winnersAliases.length > 0) {
      tSettings.playerAliases = [...tSettings.winnersAliases]; // Οι νικητές γίνονται οι νέοι παίκτες
      tSettings.numberOfPlayers = tSettings.playerAliases.length; // Ενημέρωση αριθμού παικτών (π.χ. από 4 σε 2)
      tSettings.winnersAliases = []; // Καθαρισμός για τον επόμενο γύρο
      console.log("Advancing to next round with players:", tSettings.playerAliases);
    } else {
      // Αν για κάποιο λόγο δεν υπάρχουν παίκτες ούτε νικητές
      location.hash = '#welcome-page';
      return;
    }
  }

  // 1. Extract the First and Last Player για τον τρέχοντα αγώνα
  const p1Name = tSettings.playerAliases.shift(); 
  const p2Name = tSettings.playerAliases.pop();

  if (p1Name && p2Name) {
    tSettings.currentMatch = { p1Name, p2Name };
  } else {
    tSettings.currentMatch = null;
  }

  // 3. Inject Names into the DOM
  const p1NameEl = document.querySelector('.js-p1-name');
  const p2NameEl = document.querySelector('.js-p2-name');

  if (p1NameEl) p1NameEl.textContent = p1Name || '';
  if (p2NameEl) p2NameEl.textContent = p2Name || '';
}