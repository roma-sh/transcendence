import {
	handleToggleUserMenu,
	handleOpenProfile,
	handleOpenSettings
} from "./user-menu.js";
import {
	handleOpenChooseMode,
	handleOpenSignUp,
	handleOpenLogIn,
	handleGoBackChooseMode
} from "./welcome-page.js";
import {
	handleSubmitSignUp,
	handleSubmitLogIn,
	handleGoBackSignUp,
	handleGoBackLogIn
} from "./auth-pages.js";
import {
	handleGameOptionSelect,
	handleGoBackTournament
} from "./choose-mode.js";
import {
	handleNextAfterAliases,
	handleGoBackPlayerAliases
} from "./tournament-player-aliases.js";
import {
	handleStartTournament,
	handleGoBackGameReadyPage
} from "./game-ready-page.js";
import { handleNextAfterCount } from "./tournament-player-count.js";

export function setupGlobalClicksDelegation() {
	const actions: Record<string, (event?: MouseEvent) => void> = {
			"toggle-user-menu": handleToggleUserMenu,
			"open-profile": handleOpenProfile,
			"open-settings": handleOpenSettings,
			"open-choose-mode": handleOpenChooseMode,
			"open-sign-up": handleOpenSignUp,
			"open-log-in": handleOpenLogIn,
			"submit-sign-up": handleSubmitSignUp,
			"submit-log-in": handleSubmitLogIn,
			"go-back-signup": handleGoBackSignUp,
			"go-back-login": handleGoBackLogIn,
			"select-game-option": handleGameOptionSelect,
			"start-tournament": handleStartTournament,
			"next-after-count": handleNextAfterCount,
			"next-after-aliases": handleNextAfterAliases,
			"go-back-player-aliases": handleGoBackPlayerAliases,
			"go-back-choose-mode": handleGoBackChooseMode,
			"go-back-tournament": handleGoBackTournament,
			"go-back-game-ready-page": handleGoBackGameReadyPage,
	};

	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement | null;
		if (!target) return;

		// Find nearest element that has data-action attribute
		const actionEl = target.closest("[data-action]") as HTMLElement | null;

		if (actionEl) {
			const action = actionEl.dataset.action;
			if (!action) return;

			const handler = actions[action];
			if (!handler) return;

			handler(e);
			return;
		}

		// Close dropdown if clicked outside
		const menu = document.querySelector('.js-user-dropdown') as HTMLElement | null;
		const btn = document.querySelector('.js-user-menu-button') as HTMLElement | null;
		if (menu && btn && !btn.contains(target) && !menu.contains(target)) {
				menu.style.display = 'none';
		}
	});
}
