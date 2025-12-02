import { GameSettings } from "./types.js";

const DEFAULT_SETTINGS: GameSettings = {
	ballSpeed: 9,
	paddleSpeed: 7,
	ballColor: "#FFA500",
	paddleColor: "#463D3D",
	bgColor: "#FFFFFF",
	scoreToWin: 2,
};

const SETTINGS_KEY = "pongSettings";

export function initSettingsPage() {

	const settingsBackLink = document.querySelector('.js-settings__back_btn');
	settingsBackLink?.addEventListener("click", () => {
		location.hash = '#welcome-page';
	});

	const scoreToWinInput = document.querySelector(".js-score-to-win") as HTMLInputElement | null;
	const ballSpeedInput = document.querySelector(".js-ball-speed") as HTMLInputElement | null;
	const paddleSpeedInput = document.querySelector(".js-paddle-speed") as HTMLInputElement | null;
	const ballColorInput = document.querySelector(".js-ball-color") as HTMLInputElement | null;
	const paddleColorInput = document.querySelector(".js-paddle-color") as HTMLInputElement | null;
	const bgColorInput = document.querySelector(".js-bg-color") as HTMLInputElement | null;

	const ballSpeedValue = document.querySelector(".js-ball-speed-value") as HTMLElement | null;
	const paddleSpeedValue = document.querySelector(".js-paddle-speed-value") as HTMLElement | null;

	const ballColorText = document.querySelector(".js-ball-color-text") as HTMLElement | null;
	const paddleColorText = document.querySelector(".js-paddle-color-text") as HTMLElement | null;
	const bgColorText = document.querySelector(".js-bg-color-text") as HTMLElement | null;

	const saveBtn = document.querySelector(".js-settings-save") as HTMLButtonElement | null;
	const resetBtn = document.querySelector(".js-settings-reset") as HTMLButtonElement | null;
	const messageEl = document.querySelector(".js-settings-message") as HTMLElement | null;

	if (
		!ballSpeedInput ||
		!paddleSpeedInput ||
		!ballColorInput ||
		!paddleColorInput ||
		!bgColorInput ||
		!scoreToWinInput ||
		!saveBtn ||
		!resetBtn
	) {
		console.warn("Settings inputs/buttons not found");
		return;
	}

	let settings = loadGameSettings();

	// helper to update all UI spots
	function render() {
		// main form values
		ballSpeedInput!.value = settings.ballSpeed.toString();
		paddleSpeedInput!.value = settings.paddleSpeed.toString();
		ballColorInput!.value = settings.ballColor;
		paddleColorInput!.value = settings.paddleColor;
		bgColorInput!.value = settings.bgColor;
		scoreToWinInput!.value = settings.scoreToWin.toString();

		if (ballSpeedValue) ballSpeedValue.textContent = settings.ballSpeed.toString();
		if (paddleSpeedValue) paddleSpeedValue.textContent = settings.paddleSpeed.toString();

		if (ballColorText) ballColorText.textContent = settings.ballColor;
		if (paddleColorText) paddleColorText.textContent = settings.paddleColor;
		if (bgColorText) bgColorText.textContent = settings.bgColor;
	}

	render();

	// listeners
	ballSpeedInput.addEventListener("input", () => {
		settings.ballSpeed = Number(ballSpeedInput.value);
		saveSettings(settings);
		render();
		clearMessage(messageEl);
	});

	paddleSpeedInput.addEventListener("input", () => {
		settings.paddleSpeed = Number(paddleSpeedInput.value);
		saveSettings(settings);
		render();
		clearMessage(messageEl);
	});

	ballColorInput.addEventListener("input", () => {
		settings.ballColor = ballColorInput.value;
		saveSettings(settings);
		render();
		clearMessage(messageEl);
	});

	paddleColorInput.addEventListener("input", () => {
		settings.paddleColor = paddleColorInput.value;
		saveSettings(settings);
		render();
		clearMessage(messageEl);
	});

	bgColorInput.addEventListener("input", () => {
		settings.bgColor = bgColorInput.value;
		saveSettings(settings);
		render();
		clearMessage(messageEl);
	});

	scoreToWinInput.addEventListener("input", () => {
		let value = Number(scoreToWinInput.value);
		if (!Number.isFinite(value) || value < 1) value = 1;

		settings.scoreToWin = value;
		saveSettings(settings);
		render();
		clearMessage(messageEl);
	});


	resetBtn.addEventListener("click", () => {
		settings = { ...DEFAULT_SETTINGS };
		saveSettings(settings);
		render();
		showMessage(messageEl, "Reset to default values");
	});

	saveBtn.addEventListener("click", async () => {
		showMessage(messageEl, "Settings saved");
	});
}

/* -------- helpers -------- */

export function loadGameSettings(): GameSettings {
	const raw = localStorage.getItem(SETTINGS_KEY);
	if (!raw) return { ...DEFAULT_SETTINGS };
	try {
		const parsed = JSON.parse(raw) as Partial<GameSettings>;
		return { ...DEFAULT_SETTINGS, ...parsed };
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

function saveSettings(settings: GameSettings) {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function clearMessage(el: HTMLElement | null) {
	if (el) el.textContent = "";
}

function showMessage(el: HTMLElement | null, text: string) {
	if (el) el.textContent = text;
}
