// --- 1. Βοηθητική Συνάρτηση: Δημιουργία HTML Inputs ---
export function generateInputsForAliases(tSettings) {
    let html = '';
    // Υπολογισμός του δείκτη από τον οποίο ξεκινούν τα Bots
    const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
    // Μετρητής για την σωστή αρίθμηση των Bots (ξεκινά από 1)
    let botCounter = 1;
    for (let i = 0; i < tSettings.numberOfPlayers; ++i) {
        // Ελέγχουμε αν ο τρέχων δείκτης (i) αντιστοιχεί σε Bot
        const isBotInput = i >= humanPlayersCount;
        let inputValue = '';
        let disabledAttribute = '';
        let inputClass = 'player-alias-input js-player-alias-input';
        if (isBotInput) {
            // Λογική Bot: Σωστή ονομασία (Bot 1, Bot 2, κλπ.)
            inputValue = `Bot ${botCounter}`;
            botCounter++;
            disabledAttribute = 'disabled';
            inputClass += ' bot-alias-input';
        }
        else {
            // Λογική Ανθρώπου: Κενό value για να φαίνεται το placeholder
            // και να μπορεί ο χρήστης να εισάγει το alias
            // inputValue = tSettings.playerAliases[i] || ''; // Χρησιμοποιούμε κενό string
            inputValue = '';
        }
        // Δημιουργία του HTML για το input
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
    // 🔴 ΑΦΑΙΡΟΥΜΕ ΤΗΝ ΕΚΧΩΡΗΣΗ ΣΤΟ DOM ΑΠΟ ΕΔΩ
    // H εκχώρηση θα γίνει από τη συνάρτηση που καλεί αυτή τη generateInputsForAliases
    // (π.χ., initTournamentPlayerAliasesPage).
    return html; // Επιστρέφουμε μόνο το HTML string
}
// --- 2. Βοηθητική Συνάρτηση: Έλεγχος Alias ---
async function checkAliasExists(alias) {
    const response = await fetch(`http://127.0.0.1:3000/api/checkAlias/${alias}`);
    const data = await response.json();
    return data.exists;
}
let currentTSettings = null;
// --- 3. Handler για το Κουμπί NEXT ---
async function permanentClickHandler(e) {
    if (!currentTSettings)
        return;
    e.preventDefault();
    const inputsList = document.querySelectorAll('.js-player-alias-input');
    // Εξαίρεση των Bot aliases από την επικύρωση
    const humanPlayersCount = currentTSettings.numberOfPlayers - currentTSettings.numberOfBots;
    // Παίρνουμε μόνο τα aliases των ανθρώπινων παικτών (τα πρώτα humanPlayersCount inputs)
    const humanAliases = Array.from(inputsList)
        .slice(0, humanPlayersCount)
        .map((input) => input.value.trim());
    // Έλεγχος για κενά πεδία
    if (humanAliases.some(alias => !alias)) {
        alert("Please fill in all player fields.");
        return;
    }
    const aliasesExist = [];
    const aliasesDoNotExist = [];
    // Έλεγχος αν υπάρχουν τα Aliases
    for (const alias of humanAliases) {
        const exists = await checkAliasExists(alias);
        if (exists) {
            aliasesExist.push(alias);
        }
        else {
            aliasesDoNotExist.push(alias);
        }
    }
    // Διαχείριση αποτελεσμάτων
    if (aliasesDoNotExist.length > 0) {
        alert(`Unfortunately, user(s) "${aliasesDoNotExist.join(', ')}" were not found in our database. Please sign up first.`);
        return; // Σταματάμε αν υπάρχουν μη έγκυρα aliases
    }
    // Αν φτάσουμε εδώ, όλα τα ανθρώπινα aliases είναι έγκυρα
    if (aliasesExist.length > 0 || currentTSettings.numberOfBots > 0) {
        // *****************************************************************
        // ** Δημιουργία των Bot Aliases δυναμικά **
        // *****************************************************************
        const createdBotAliases = [];
        const totalBots = currentTSettings.numberOfBots;
        for (let i = 0; i < totalBots; i++) {
            createdBotAliases.push(`Bot ${i + 1}`);
        }
        // 6. ΣΥΝΔΥΑΣΜΟΣ Ανθρώπινων Παικτών και Bots
        const finalTournamentAliases = [
            ...aliasesExist, // Επιβεβαιωμένοι άνθρωποι
            ...createdBotAliases // Δημιουργημένα Bots
        ];
        currentTSettings.playerAliases = finalTournamentAliases;
        console.log("--- FINAL TOURNAMENT ALIASES ---");
        console.log("All players are registered (Humans + Bots):", currentTSettings.playerAliases);
        console.log("Total Players:", currentTSettings.playerAliases.length);
        console.log("---------------------------------");
        location.hash = '#game-ready-page';
    }
}
// --- 4. Εγγραφή Listeners ---
export function registerNextClickAfterAliases(tSettings) {
    const btnEl = document.querySelector('.js-next-btn-after-aliases');
    const inputsContainer = document.querySelector('.aliase-inputs');
    if (!btnEl || !inputsContainer)
        return;
    // ******************************************************
    // 1. ΔΙΟΡΘΩΣΗ: Καθαρισμός των Aliases 
    // Πρέπει να αφαιρέσουμε τα Bot aliases ή τυχόν παλιά strings
    // πριν δημιουργήσουμε τα inputs.
    const humanPlayersCount = tSettings.numberOfPlayers - tSettings.numberOfBots;
    // Διασφαλίζουμε ότι η λίστα tSettings.playerAliases περιέχει ΜΟΝΟ
    // τα aliases των ανθρώπων (ή είναι άδεια).
    // Χρησιμοποιούμε slice για να διατηρήσουμε μόνο τους πρώτους N παίκτες,
    // οι οποίοι πρέπει να είναι οι άνθρωποι.
    if (tSettings.playerAliases.length > 0) {
        tSettings.playerAliases = tSettings.playerAliases.slice(0, humanPlayersCount);
    }
    // 2. UPDATE SETTINGS (πριν τη δημιουργία του HTML)
    currentTSettings = tSettings;
    // ******************************************************
    // 3. ΔΗΜΙΟΥΡΓΙΑ/ΕΚΧΩΡΗΣΗ ΤΟΥ HTML (Αποκατάσταση των πεδίων)
    // Τώρα η generateInputsForAliases θα χρησιμοποιήσει τη σωστή, καθαρισμένη λίστα.
    const aliasesHtml = generateInputsForAliases(tSettings);
    inputsContainer.innerHTML = aliasesHtml;
    // 4. ΕΓΓΡΑΦΗ LISTENER (μόνο μία φορά)
    if (!btnEl.hasAttribute('data-listener-registered')) {
        btnEl.addEventListener('click', permanentClickHandler);
        btnEl.setAttribute('data-listener-registered', 'true');
        console.log('Listener registered for the first time.');
    }
    else {
        console.log('Listener already registered. Settings updated.');
    }
}
