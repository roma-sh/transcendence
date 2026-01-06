const DEFAULT_SETTINGS = {
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
    const scoreToWinInput = document.querySelector(".js-score-to-win");
    const ballSpeedInput = document.querySelector(".js-ball-speed");
    const paddleSpeedInput = document.querySelector(".js-paddle-speed");
    const ballColorInput = document.querySelector(".js-ball-color");
    const paddleColorInput = document.querySelector(".js-paddle-color");
    const bgColorInput = document.querySelector(".js-bg-color");
    const ballSpeedValue = document.querySelector(".js-ball-speed-value");
    const paddleSpeedValue = document.querySelector(".js-paddle-speed-value");
    const ballColorText = document.querySelector(".js-ball-color-text");
    const paddleColorText = document.querySelector(".js-paddle-color-text");
    const bgColorText = document.querySelector(".js-bg-color-text");
    const saveBtn = document.querySelector(".js-settings-save");
    const resetBtn = document.querySelector(".js-settings-reset");
    const messageEl = document.querySelector(".js-settings-message");
    if (!ballSpeedInput ||
        !paddleSpeedInput ||
        !ballColorInput ||
        !paddleColorInput ||
        !bgColorInput ||
        !scoreToWinInput ||
        !saveBtn ||
        !resetBtn) {
        console.warn("Settings inputs/buttons not found");
        return;
    }
    let settings = loadGameSettings();
    // helper to update all UI spots
    function render() {
        // main form values
        ballSpeedInput.value = settings.ballSpeed.toString();
        paddleSpeedInput.value = settings.paddleSpeed.toString();
        ballColorInput.value = settings.ballColor;
        paddleColorInput.value = settings.paddleColor;
        bgColorInput.value = settings.bgColor;
        scoreToWinInput.value = settings.scoreToWin.toString();
        if (ballSpeedValue)
            ballSpeedValue.textContent = settings.ballSpeed.toString();
        if (paddleSpeedValue)
            paddleSpeedValue.textContent = settings.paddleSpeed.toString();
        if (ballColorText)
            ballColorText.textContent = settings.ballColor;
        if (paddleColorText)
            paddleColorText.textContent = settings.paddleColor;
        if (bgColorText)
            bgColorText.textContent = settings.bgColor;
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
        if (!Number.isFinite(value) || value < 1)
            value = 1;
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
export function loadGameSettings() {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw)
        return { ...DEFAULT_SETTINGS };
    try {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
    }
    catch {
        return { ...DEFAULT_SETTINGS };
    }
}
function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function clearMessage(el) {
    if (el)
        el.textContent = "";
}
function showMessage(el, text) {
    if (el)
        el.textContent = text;
}
