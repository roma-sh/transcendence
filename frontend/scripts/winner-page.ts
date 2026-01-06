import { TournamentSettings } from "./types";

interface TSettings {
}


export function initWinnerAnnouncementPage(tSettings: TournamentSettings): void {

    console.log("First place :", tSettings.firstPlaceAlias);
    console.log("Second place :", tSettings.secondPlaceAlias);
    const winnerSection = document.getElementById('winner-page');
    
    // document.querySelectorAll('section').forEach(section => {
    //     section.style.display = 'none';
    // });
    
    // if (winnerSection) {
    //     winnerSection.style.display = 'block'; 
    // }

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

// function displayWinners(firstPlaceElement: string | null, secondPlaceElement: string | null): void {
    
//     const hash = location.hash;
    
//     const queryString = hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '';
//     const urlParams = new URLSearchParams(queryString);
    
//     const firstPlace = urlParams.get('first'); 
//     const secondPlace = urlParams.get('second'); 

//     if (firstPlace && firstPlaceElement) {
//         firstPlaceElement.textContent = `1st Place: ${decodeURIComponent(firstPlace)}`;
//     } else if (firstPlaceElement) {
//         firstPlaceElement.textContent = `1st Place: `;
//     }

//     if (secondPlace && secondPlaceElement) {
//         secondPlaceElement.textContent = `2nd Place: ${decodeURIComponent(secondPlace)}`;
//     } else if (secondPlaceElement) {
//         secondPlaceElement.textContent = `2nd Place: `;
//     }
// }

function displayWinners(firstPlaceName: string, secondPlaceName: string): void {
    // Βρίσκουμε τα στοιχεία στο HTML όπου θα γραφτούν τα ονόματα
    // Αντικατάστησε το 'first-place-id' με το πραγματικό ID που έχεις στο HTML σου
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