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

    container.innerHTML = '<p class="text-center">Loading on-chain tournament data...</p>';

    try {
        const tournaments = await contractService.getRecentWinners(5);

        if (!tournaments.length) {
            container.innerHTML = '<p class="text-center">No tournaments found on-chain yet or unable to read from blockchain.</p>';
            return;
        }

        // Extract winner name from tournament name (format: "Pong Tournament - Winner: <name>")
        const extractWinnerName = (tournamentName: string): string => {
            const match = tournamentName.match(/Winner:\s*(.+?)(?:\s*\|)?$/i);
            if (match && match[1]) {
                return match[1].trim();
            }
            const parts = tournamentName.split(' - ');
            if (parts.length > 1) {
                return parts[parts.length - 1].trim();
            }
            return 'Unknown';
        };

        //table
        let tableHTML = `
            <div class="overflow-x-auto w-full">
                <table class="min-w-full border-collapse border border-(--border-soft-gray) rounded-[10px] overflow-hidden" style="table-layout: fixed; width: 100%;">
                    <thead>
                        <tr class="bg-(--main-color) text-white">
                            <th class="border border-(--border-soft-gray) px-[16px] py-[12px] text-left font-bold text-[14px]" style="width: 33.33%;">Tournament ID</th>
                            <th class="border border-(--border-soft-gray) px-[16px] py-[12px] text-left font-bold text-[14px]" style="width: 33.33%;">Winner</th>
                            <th class="border border-(--border-soft-gray) px-[16px] py-[12px] text-left font-bold text-[14px]" style="width: 33.33%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        tournaments.forEach((t) => {
            const winnerName = extractWinnerName(t.name);
            const status = t.finalized ? "Finalized" : "Not Finalized";
            const statusClass = t.finalized 
                ? "text-green-600 font-semibold" 
                : "text-gray-500";
            
            tableHTML += `
                <tr class="bg-white hover:bg-gray-50">
                    <td class="border border-(--border-soft-gray) px-[16px] py-[12px] text-[14px]">${t.id}</td>
                    <td class="border border-(--border-soft-gray) px-[16px] py-[12px] text-[14px] font-medium">${winnerName}</td>
                    <td class="border border-(--border-soft-gray) px-[16px] py-[12px] text-[14px] ${statusClass}">${status}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = tableHTML;
    } catch (err) {
        console.error("[Blockchain] Unexpected error while loading winners:", err);
        container.innerHTML = '<p class="text-center text-red-600">Failed to load data from blockchain. Please check your wallet and network.</p>';
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