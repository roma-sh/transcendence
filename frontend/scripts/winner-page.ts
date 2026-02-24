import { TournamentSettings } from "./types.js";

export function handleGoToWelcomePage() {
    location.hash = '#welcome-page';
}

export function initWinnerAnnouncementPage(tSettings: TournamentSettings): void {
    const firstPlaceEl = document.getElementById('first-place-winner') as HTMLElement | null;
    const secondPlaceEl = document.getElementById('second-place-winner') as HTMLElement | null;

    const { firstPlaceAlias, secondPlaceAlias } = tSettings;

    if (firstPlaceEl) {
        // Χρήση χρυσού μεταλλίου για τον 1ο
        firstPlaceEl.innerHTML = `🥇 1st Place: <span class="uppercase">${firstPlaceAlias || '---'}</span>`;
    }
    
    if (secondPlaceEl) {
        // Χρήση ασημένιου μεταλλίου για τον 2ο
        secondPlaceEl.innerHTML = `🥈 2nd Place: <span class="uppercase">${secondPlaceAlias || '---'}</span>`;
    }
}