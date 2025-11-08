/**
 * Εμφανίζει τη σελίδα ανακοίνωσης νικητών και ανακτά τα ονόματα από το URL.
 * Η εμφάνιση/απόκρυψη του section γίνεται μέσω CSS :target ή εξωτερικής συνάρτησης.
 * @param tSettings Το αντικείμενο ρυθμίσεων του τουρνουά.
 */
export function initWinnerAnnouncementPage(tSettings) {
    const winnerSection = document.getElementById('winner-page');
    // 1. Κρύβουμε όλα τα sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    // 2. Εμφανίζουμε τον στόχο
    if (winnerSection) {
        // Χρησιμοποιήστε 'block' ή 'flex' ανάλογα με το layout σας
        winnerSection.style.display = 'block';
    }
    // ----------------------------------------------------
    // ΛΟΓΙΚΗ ΣΕΛΙΔΑΣ
    // ----------------------------------------------------
    // 1. Καθορισμός των DOM elements
    const firstPlaceElement = document.getElementById('first-place-winner');
    const secondPlaceElement = document.getElementById('second-place-winner');
    // Χρησιμοποιούμε querySelector για class
    const welcomeButton = document.querySelector('.js-go-to-welcome-button');
    // Εμφανίζει τους νικητές
    displayWinners(firstPlaceElement, secondPlaceElement);
    // 2. Ορισμός Listener για το κουμπί επιστροφής
    if (welcomeButton) {
        welcomeButton.onclick = function () {
            // Επιστροφή στην αρχική σελίδα (welcome-page)
            location.hash = '#welcome-page';
        };
    }
}
/**
 * Ανακτά τα ονόματα των νικητών από το URL hash και ενημερώνει το DOM.
 * @param firstPlaceElement Το στοιχείο για την 1η θέση (h1).
 * @param secondPlaceElement Το στοιχείο για την 2η θέση (h3).
 */
function displayWinners(firstPlaceElement, secondPlaceElement) {
    const hash = location.hash;
    // 1. Απομόνωση των query parameters από το hash (π.χ. #winner-page?first=Name1&second=Name2)
    // Αν υπάρχει '?', παίρνουμε το κείμενο μετά από αυτό.
    const queryString = hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '';
    const urlParams = new URLSearchParams(queryString);
    // 2. Ανάκτηση των ονομάτων
    const firstPlace = urlParams.get('first');
    const secondPlace = urlParams.get('second');
    // 3. Εισαγωγή του ονόματος του 1ου νικητή
    if (firstPlace && firstPlaceElement) {
        firstPlaceElement.textContent = `1st Place: ${decodeURIComponent(firstPlace)}`;
    }
    else if (firstPlaceElement) {
        firstPlaceElement.textContent = `1st Place: `;
    }
    // 4. Εισαγωγή του ονόματος του 2ου νικητή
    if (secondPlace && secondPlaceElement) {
        secondPlaceElement.textContent = `2nd Place: ${decodeURIComponent(secondPlace)}`;
    }
    else if (secondPlaceElement) {
        secondPlaceElement.textContent = `2nd Place: `;
    }
}
