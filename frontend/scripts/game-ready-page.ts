import { TournamentSettings } from "./types.js";
import { game } from "./game.js";

// Η συνάρτηση getGameReadyHTML αφαιρείται, καθώς το HTML είναι τώρα στατικό στο index.html.

/**
 * Εμφανίζει τα ονόματα των παικτών στην οθόνη ετοιμότητας
 * και ρυθμίζει τον listener για την έναρξη του παιχνιδιού.
 * @param tSettings Οι ρυθμίσεις του τουρνουά που περιέχουν τα aliases των παικτών.
 */
export function initGameReadyPage(tSettings: TournamentSettings) {
  // Δεν χρειάζεται πλέον να κάνουμε query για το '.game-ready-page-container' 
  // ή να χρησιμοποιούμε innerHTML, καθώς το HTML είναι πλέον στατικό.
  
  // 1. Παίρνουμε τα ονόματα
  const p1Name = tSettings.playerAliases[0];
  const p2Name = tSettings.playerAliases[1];
  
  // 2. Εισαγωγή Ονομάτων στο DOM
  const p1NameEl = document.querySelector('.js-p1-name');
  const p2NameEl = document.querySelector('.js-p2-name');

  if (p1NameEl) {
    p1NameEl.textContent = p1Name;
  }
  if (p2NameEl) {
    p2NameEl.textContent = p2Name;
  }
  
  // 3. Καταχώρηση του event listener για το κουμπί 'GO!'
  const goBtn = document.querySelector('.js-start-game-btn');
  if (goBtn) {
    // Χρησιμοποιούμε μια named function για τον handler
    const startGameHandler = () => {
        // Καλούμε το game με τα σωστά ονόματα
        game(p1Name, p2Name); 
        
        // Πάμε στη σελίδα του παιχνιδιού
        location.hash = '#game-page';
    };
    
    // Προσθέτουμε τον listener, χρησιμοποιώντας { once: true } για να διασφαλίσουμε 
    // ότι δεν θα εκτελεστεί ποτέ δύο φορές, ακόμα κι αν η initGameReadyPage κληθεί ξανά.
    goBtn.addEventListener('click', startGameHandler, { once: true });
  }
}
