import { TournamentSettings } from "./types.js";
import { game } from "./game.js";

/**
 * Εμφανίζει τα ονόματα των παικτών στην οθόνη ετοιμότητας
 * και ρυθμίζει τον listener για την έναρξη του παιχνιδιού.
 * Χρησιμοποιεί τον ΠΡΩΤΟ και τον ΤΕΛΕΥΤΑΙΟ παίκτη από τη λίστα και τους ΑΦΑΙΡΕΙ
 * για να προετοιμάσει το επόμενο ζευγάρι.
 * @param tSettings Οι ρυθμίσεις του τουρνουά που περιέχουν τα aliases των παικτών.
 */
export function initGameReadyPage(tSettings: TournamentSettings) {
  
   console.log("Aliases BEFORE extraction:", tSettings.playerAliases);
  console.log("List Length BEFORE extraction:", tSettings.playerAliases.length);
  // 1. Εξαγωγή του Πρώτου (Αρχή της λίστας)
  // shift() αφαιρεί και επιστρέφει το πρώτο στοιχείο.
  const p1Name = tSettings.playerAliases.shift(); 
  
  // 2. Εξαγωγή του Τελευταίου (Τέλος της λίστας)
  // pop() αφαιρεί και επιστρέφει το τελευταίο στοιχείο.
  const p2Name = tSettings.playerAliases.pop(); 
  
   console.log("p1Name (shift):", p1Name);
  console.log("p2Name (pop):", p2Name);
  // Έλεγχος για να διασφαλιστεί ότι έχουμε δύο ονόματα
  if (!p1Name || !p2Name) {
    console.warn("Tournament phase complete or not enough players for a match.");
    // Εδώ θα έπρεπε να υπάρχει λογική για το τέλος του τουρνουά
    return;
  }
  
  // 3. Εισαγωγή Ονομάτων στο DOM
  const p1NameEl = document.querySelector('.js-p1-name');
  const p2NameEl = document.querySelector('.js-p2-name');

  if (p1NameEl) {
    p1NameEl.textContent = p1Name;
  }
  if (p2NameEl) {
    p2NameEl.textContent = p2Name;
  }
  
  // 4. Καταχώρηση του event listener για το κουμπί 'GO!'
  const goBtn = document.querySelector('.js-start-game-btn');
  if (goBtn) {
    // Χρησιμοποιούμε μια named function για τον handler
    const startGameHandler = () => {
        // Καλούμε το game με τα σωστά ονόματα
        game(p1Name, p2Name); 
        

        // 🔴 ΔΙΟΡΘΩΣΗ: Προσθέστε ένα σαφές μήνυμα για το ποιοι παίζουν
    console.log(`Starting match: ${p1Name} vs ${p2Name}`);
    
    // 🔴 ΔΙΟΡΘΩΣΗ: Αλλάξτε το παλιό μήνυμα ώστε να είναι σαφές ότι πρόκειται για τους ΕΠΟΜΕΝΟΥΣ παίκτες
    console.log("Remaining players for the next match:", tSettings.playerAliases); 
    
        // Πάμε στη σελίδα του παιχνιδιού
        location.hash = '#game-page';
    };
    
    // Προσθέτουμε τον listener, χρησιμοποιώντας { once: true }.
    goBtn.addEventListener('click', startGameHandler, { once: true });
  }
}