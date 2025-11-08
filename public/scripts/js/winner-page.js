export function initWinnerAnnouncementPage(tSettings) {
    const winnerSection = document.getElementById('winner-page');
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    if (winnerSection) {
        winnerSection.style.display = 'block';
    }
    const firstPlaceElement = document.getElementById('first-place-winner');
    const secondPlaceElement = document.getElementById('second-place-winner');
    const welcomeButton = document.querySelector('.js-go-to-welcome-button');
    displayWinners(firstPlaceElement, secondPlaceElement);
    if (welcomeButton) {
        welcomeButton.onclick = function () {
            location.hash = '#welcome-page';
        };
    }
}
function displayWinners(firstPlaceElement, secondPlaceElement) {
    const hash = location.hash;
    const queryString = hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '';
    const urlParams = new URLSearchParams(queryString);
    const firstPlace = urlParams.get('first');
    const secondPlace = urlParams.get('second');
    if (firstPlace && firstPlaceElement) {
        firstPlaceElement.textContent = `1st Place: ${decodeURIComponent(firstPlace)}`;
    }
    else if (firstPlaceElement) {
        firstPlaceElement.textContent = `1st Place: `;
    }
    if (secondPlace && secondPlaceElement) {
        secondPlaceElement.textContent = `2nd Place: ${decodeURIComponent(secondPlace)}`;
    }
    else if (secondPlaceElement) {
        secondPlaceElement.textContent = `2nd Place: `;
    }
}
