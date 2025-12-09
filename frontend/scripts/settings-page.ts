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

let currentSettings: GameSettings = { ...DEFAULT_SETTINGS };

let settingsPageInitialized = false;

type SettingsDOM = {
	scoreToWinInput: HTMLInputElement | null;
	ballSpeedInput: HTMLInputElement | null;
	paddleSpeedInput: HTMLInputElement | null;
	ballColorInput: HTMLInputElement | null;
	paddleColorInput: HTMLInputElement | null;
	bgColorInput: HTMLInputElement | null;

	ballSpeedValue: HTMLElement | null;
	paddleSpeedValue: HTMLElement | null;

	ballColorText: HTMLElement | null;
	paddleColorText: HTMLElement | null;
	bgColorText: HTMLElement | null;

	messageEl: HTMLElement | null;
};

let settingsDOM: SettingsDOM | null = null;

export function handleGoBackSettings() {
	location.hash = '#welcome-page';
}

function initSettingsDOM(): SettingsDOM | null {
	const dom: SettingsDOM = {
		scoreToWinInput: document.querySelector(".js-score-to-win"),
		ballSpeedInput: document.querySelector(".js-ball-speed"),
		paddleSpeedInput: document.querySelector(".js-paddle-speed"),
		ballColorInput: document.querySelector(".js-ball-color"),
		paddleColorInput: document.querySelector(".js-paddle-color"),
		bgColorInput: document.querySelector(".js-bg-color"),

		ballSpeedValue: document.querySelector(".js-ball-speed-value"),
		paddleSpeedValue: document.querySelector(".js-paddle-speed-value"),

		ballColorText: document.querySelector(".js-ball-color-text"),
		paddleColorText: document.querySelector(".js-paddle-color-text"),
		bgColorText: document.querySelector(".js-bg-color-text"),

		messageEl: document.querySelector(".js-settings-message"),
	};

	if (
		!dom.scoreToWinInput ||
		!dom.ballSpeedInput ||
		!dom.paddleSpeedInput ||
		!dom.ballColorInput ||
		!dom.paddleColorInput ||
		!dom.bgColorInput
	) {
		console.warn("Settings inputs not found");
		return null;
	}

	return dom;
}


export function initSettingsPage() {
	if (!settingsDOM) {
		settingsDOM = initSettingsDOM();
		if (!settingsDOM) return;
	}

	currentSettings = loadGameSettings();
	render(currentSettings);

	if (settingsPageInitialized) {
		return;
	}
	settingsPageInitialized = true;

	const d = settingsDOM;

	// listeners
	d.ballSpeedInput!.addEventListener("input", () => {
		currentSettings.ballSpeed = Number(d.ballSpeedInput!.value);
		render(currentSettings);
		clearMessage(d.messageEl);
	});

	d.paddleSpeedInput!.addEventListener("input", () => {
		currentSettings.paddleSpeed = Number(d.paddleSpeedInput!.value);
		render(currentSettings);
		clearMessage(d.messageEl);
	});

	d.ballColorInput!.addEventListener("input", () => {
		currentSettings.ballColor = d.ballColorInput!.value;
		render(currentSettings);
		clearMessage(d.messageEl);
	});

	d.paddleColorInput!.addEventListener("input", () => {
		currentSettings.paddleColor = d.paddleColorInput!.value;
		render(currentSettings);
		clearMessage(d.messageEl);
	});

	d.bgColorInput!.addEventListener("input", () => {
		currentSettings.bgColor = d.bgColorInput!.value;
		render(currentSettings);
		clearMessage(d.messageEl);
	});

	d.scoreToWinInput!.addEventListener("input", () => {
		let value = Number(d.scoreToWinInput!.value);
		if (!Number.isFinite(value) || value < 1) value = 1;

		currentSettings.scoreToWin = value;
		render(currentSettings);
		clearMessage(d.messageEl);
	});
}

function render(settings: GameSettings) {

	if (!settingsDOM) return;

	const d = settingsDOM;

	// main form values
	d.ballSpeedInput!.value = settings.ballSpeed.toString();
	d.paddleSpeedInput!.value = settings.paddleSpeed.toString();
	d.ballColorInput!.value = settings.ballColor;
	d.paddleColorInput!.value = settings.paddleColor;
	d.bgColorInput!.value = settings.bgColor;
	d.scoreToWinInput!.value = settings.scoreToWin.toString();

	if (d.ballSpeedValue) d.ballSpeedValue.textContent = settings.ballSpeed.toString();
	if (d.paddleSpeedValue) d.paddleSpeedValue.textContent = settings.paddleSpeed.toString();

	if (d.ballColorText) d.ballColorText.textContent = settings.ballColor;
	if (d.paddleColorText) d.paddleColorText.textContent = settings.paddleColor;
	if (d.bgColorText) d.bgColorText.textContent = settings.bgColor;
}

export function handleSettingsSave() {
	if (!settingsDOM) return;
	saveSettings(currentSettings);
	showMessage(settingsDOM.messageEl, "Settings saved");
}

export function handleSettingsReset() {
	if (!settingsDOM) return;
	currentSettings = { ...DEFAULT_SETTINGS };
	render(currentSettings);
	showMessage(settingsDOM.messageEl, "Reset to default values");
}

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
