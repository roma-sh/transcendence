import { TournamentSettings } from "./types.js";
import { contractService } from "./contract-service.js";

export function handleGoToWelcomePage() {
    location.hash = '#welcome-page';
}

export async function handleLoadBlockchainWinners(): Promise<void> {
    const container = document.getElementById('blockchain-winners') as HTMLElement | null;
    if (!container) {
        return;
    }

    container.textContent = "Loading on-chain tournament data...";

    try {
        const tournaments = await contractService.getRecentWinners(5);

        if (!tournaments.length) {
            container.textContent = "No tournaments found on-chain yet or unable to read from blockchain.";
            return;
        }

        const lines = tournaments.map((t) => {
            const status = t.finalized ? "finalized" : "not finalized";
            return `ID ${t.id} | ${t.name} | Winner: ${t.winner} | ${status}`;
        });

        container.textContent = lines.join("\n");
    } catch (err) {
        console.error("[Blockchain] Unexpected error while loading winners:", err);
        container.textContent = "Failed to load data from blockchain. Please check your wallet and network.";
    }
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