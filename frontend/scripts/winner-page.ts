import { TournamentSettings } from "./types";

interface TSettings {
}


export function initWinnerAnnouncementPage(tSettings: TournamentSettings): void {

    console.log("First place :", tSettings.firstPlaceAlias);
    console.log("Second place :", tSettings.secondPlaceAlias);
    const winnerSection = document.getElementById('winner-page');

    const firstPlaceElement = tSettings.firstPlaceAlias;
    const secondPlaceElement = tSettings.secondPlaceAlias;
    
    const welcomeButton = document.querySelector('.js-go-to-welcome-button') as HTMLButtonElement | null;
    
    displayWinners(firstPlaceElement, secondPlaceElement); 

    if (welcomeButton) {
        welcomeButton.onclick = function(): void {
            location.hash = 'welcome-page';
        };
    }
}

function displayWinners(firstPlaceName: string, secondPlaceName: string): void {
    console.log("First place from display:", firstPlaceName);
    console.log("Second place from display:", secondPlaceName);

    const firstElem = document.getElementById('first-place-winner');
    const secondElem = document.getElementById('second-place-winner');

    if (firstElem) {
        firstElem.textContent = `1st Place: ${firstPlaceName}`;
    }

    if (secondElem) {
        secondElem.textContent = `2nd Place: ${secondPlaceName}`;
    }
}