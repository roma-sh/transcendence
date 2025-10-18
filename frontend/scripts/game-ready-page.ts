import { TournamentSettings } from "./types.js";
import { game } from "./game.js";

/**
 * Displays player names on the ready screen and sets up the listener to start the game.
 * It uses and removes the FIRST and LAST player from the list to prepare the next pair.
 * @param tSettings The tournament settings containing player aliases.
 */
export function initGameReadyPage(tSettings: TournamentSettings) {
  
  console.log("Aliases BEFORE extraction:", tSettings.playerAliases);
  console.log("List Length BEFORE extraction:", tSettings.playerAliases.length);
  
  // 1. Extract the First Player (Start of the list)
  // shift() removes and returns the first element.
  const p1Name = tSettings.playerAliases.shift(); 
  
  // 2. Extract the Last Player (End of the list)
  // pop() removes and returns the last element.
  const p2Name = tSettings.playerAliases.pop();
  
  console.log("p1Name (shift):", p1Name);
  console.log("p2Name (pop):", p2Name);
  
  // Check to ensure we have two names
  if (!p1Name || !p2Name) {
    console.warn("Tournament phase complete or not enough players for a match.");

    // HERE IS T HAS TO CREATE THE NEW LISTS WITH THE WINNERS AND START THE LOGIC FROM THE START
    // (I will store the winners in the tSettings, not in the base, 
    // probably the wins in the base are not needed also, unless we want statistics)
    location.hash = '#welcome-page'
    // Tournament end logic should be implemented here
    return;
  }
  
  // 3. Inject Names into the DOM
  const p1NameEl = document.querySelector('.js-p1-name');
  const p2NameEl = document.querySelector('.js-p2-name');

  if (p1NameEl) {
    p1NameEl.textContent = p1Name;
  }
  if (p2NameEl) {
    p2NameEl.textContent = p2Name;
  }
  
  // 4. Register the event listener for the 'GO!' button
  const goBtn = document.querySelector('.js-start-game-btn');
  if (goBtn) {
    // Use a named function for the handler
    const startGameHandler = () => {
        // Call the game function with the correct names
        game(p1Name, p2Name); 
        

        // FIX: Add a clear message showing who is playing
        console.log(`Starting match: ${p1Name} vs ${p2Name}`);
    
        // FIX: Update the remaining players message to show the NEXT players
        if (tSettings.playerAliases.length == 0)
        {
          tSettings.playerAliases.length = 200;
        }
        console.log("Remaining players for the next match:", tSettings.playerAliases); 
        // Navigate to the game page
        location.hash = '#game-page';
    };
    
    // Add the listener, using { once: true } to ensure it only runs once.
    goBtn.addEventListener('click', startGameHandler, { once: true });
  }
}
