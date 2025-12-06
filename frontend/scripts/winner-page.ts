import { TournamentSettings } from "./types.js";

export function handleGoToWelcomePage() {
    location.hash = '#welcome-page';
}

export function initWinnerAnnouncementPage(tSettings: TournamentSettings): void {

    console.log('initWinnerAnnouncementPage called');

    const firstPlaceEl = document.getElementById('first-place-winner') as HTMLElement | null;
    const secondPlaceEl = document.getElementById('second-place-winner') as HTMLElement | null;

    const { firstPlaceAlias, secondPlaceAlias } = tSettings;

    if (firstPlaceEl) {
        firstPlaceEl.textContent = `1st Place: ${firstPlaceAlias || ''}`;
    }
    if (secondPlaceEl) {
        secondPlaceEl.textContent = `2nd Place: ${secondPlaceAlias || ''}`;
    }
}
