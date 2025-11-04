import { game } from "./game.js";
/**
 * Displays player names on the ready screen and sets up the listener to start the game.
 * It uses and removes the FIRST and LAST player from the list to prepare the next pair.
 * @param tSettings The tournament settings containing player aliases.
 */
export async function initGameReadyPage(tSettings) {
    if (tSettings.playerAliases.length == 0) {
        if (tSettings.winnersAliases.length == 1) {
            tSettings.playerAliases = [];
            tSettings.winnersAliases = [];
            location.hash = '#welcome-page';
            return;
        }
        console.log('Winners: ' + tSettings.winnersAliases);
        tSettings.playerAliases = tSettings.winnersAliases.slice(); // Copy winners to the next round
        tSettings.winnersAliases = []; // Clear winners for the next round
        console.log("All matches in this round completed. Preparing for the next round.");
        location.hash = '#game-ready-page';
    }
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
    // Navigate to the game page
    // 3. Inject Names into the DOM
    const p1NameEl = document.querySelector('.js-p1-name');
    const p2NameEl = document.querySelector('.js-p2-name');
    if (p1NameEl) {
        p1NameEl.textContent = p1Name || '';
    }
    if (p2NameEl) {
        p2NameEl.textContent = p2Name || '';
    }
    // 4. Register the event listener for the 'GO!' button
    const goBtn = document.querySelector('.js-start-game-btn');
    if (goBtn) {
        // Use a named function for the handler
        const startGameHandler = async () => {
            // Call the game function with the correct names
            // FIX: Add a clear message showing who is playing
            console.log(`Starting match: ${p1Name} vs ${p2Name}`);
            location.hash = '#game-page';
            game(p1Name, p2Name);
            // FIX: Update the remaining players message to show the NEXT players
        };
        // Add the listener, using { once: true } to ensure it only runs once.
        goBtn.addEventListener('click', startGameHandler, { once: true });
    }
}
