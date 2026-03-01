import { toggleOpacity, showMessage } from "./settings-page.js";
import { updatePassMsgDot } from "./profile-page.js";

let pending2FAUserId: number | null = null;

//Toggle 2FA modal
export function handleToggle2FAModal(): void {
  const modal = document.querySelector('.js-2fa-modal') as HTMLElement | null;
  if (!modal) return;

  if (modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
    load2FAStatus();
  } else {
    modal.classList.add('hidden');
    reset2FAModal();
  }
}

//Close 2FA modal
export function handleClose2FAModal(): void {
  const modal = document.querySelector('.js-2fa-modal') as HTMLElement | null;
  if (modal) {
    modal.classList.add('hidden');
    reset2FAModal();
  }
}

//Load 2FA status from server
async function load2FAStatus(): Promise<void> {
  try {
    const response = await fetch('/api/2fa/status', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      console.error('Failed to load 2FA status');
      return;
    }

    const data = await response.json();
    const isEnabled = data.enabled === true;

    const setupSection = document.querySelector('.js-2fa-setup-section') as HTMLElement | null;
    const enabledSection = document.querySelector('.js-2fa-enabled-section') as HTMLElement | null;
    const disabledSection = document.querySelector('.js-2fa-disabled-section') as HTMLElement | null;
    const statusEl = document.querySelector('.js-2fa-status') as HTMLElement | null;

    if (statusEl) {
      statusEl.textContent = isEnabled ? 'Enabled' : 'Not enabled';
    }

    if (isEnabled) {
      if (setupSection) setupSection.classList.add('hidden');
      if (enabledSection) enabledSection.classList.remove('hidden');
      if (disabledSection) disabledSection.classList.add('hidden');
    } else {
      if (setupSection) setupSection.classList.add('hidden');
      if (enabledSection) enabledSection.classList.add('hidden');
      if (disabledSection) disabledSection.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error loading 2FA status:', err);
  }
}

//Setup 2FA qr
export async function handleSetup2FA(): Promise<void> {
  const setupSection = document.querySelector('.js-2fa-setup-section') as HTMLElement | null;
  const enabledSection = document.querySelector('.js-2fa-enabled-section') as HTMLElement | null;
  const disabledSection = document.querySelector('.js-2fa-disabled-section') as HTMLElement | null;
  const qrCodeImg = document.getElementById('js-2fa-qrcode') as HTMLImageElement | null;
  const secretEl = document.querySelector('.js-2fa-secret') as HTMLElement | null;
  const verifyInput = document.querySelector('.js-2fa-verify-input') as HTMLInputElement | null;

  if (!setupSection || !qrCodeImg || !secretEl || !verifyInput) return;

  try {
    const response = await fetch('/api/2fa/setup', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      show2FAMessage('Failed to setup 2FA', 'red');
      return;
    }

    const data = await response.json();
    qrCodeImg.src = data.qrCode;
    secretEl.textContent = data.manualEntryKey;

    if (setupSection) setupSection.classList.remove('hidden');
    if (enabledSection) enabledSection.classList.add('hidden');
    if (disabledSection) disabledSection.classList.add('hidden');

    verifyInput.value = '';
    verifyInput.focus();
  } catch (err) {
    console.error('Error setting up 2FA:', err);
    show2FAMessage('Error setting up 2FA', 'red');
  }
}

//Verify and enable 2FA
export async function handleVerifyEnable2FA(): Promise<void> {
  const verifyInput = document.querySelector('.js-2fa-verify-input') as HTMLInputElement | null;
  if (!verifyInput) return;

  const token = verifyInput.value.trim();
  if (token.length !== 6 || !/^\d{6}$/.test(token)) {
    show2FAMessage('Please enter a valid 6-digit code', 'red');
    return;
  }

  try {
    const response = await fetch('/api/2fa/verify-enable', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!response.ok) {
      show2FAMessage(data.message || 'Invalid code', 'red');
      verifyInput.value = '';
      return;
    }

    show2FAMessage('2FA enabled successfully', 'green');
    setTimeout(() => {
      load2FAStatus();
      reset2FAModal();
    }, 1500);
  } catch (err) {
    console.error('Error verifying 2FA:', err);
    show2FAMessage('Error verifying code', 'red');
  }
}

//Disable 2FA
export async function handleDisable2FA(): Promise<void> {
  if (!confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
    return;
  }

  try {
    const response = await fetch('/api/2fa/disable', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (!response.ok) {
      show2FAMessage(data.message || 'Failed to disable 2FA', 'red');
      return;
    }

    show2FAMessage('2FA disabled successfully', 'green');
    setTimeout(() => {
      load2FAStatus();
      reset2FAModal();
    }, 1500);
  } catch (err) {
    console.error('Error disabling 2FA:', err);
    show2FAMessage('Error disabling 2FA', 'red');
  }
}


//Show 2FA message
function show2FAMessage(text: string, color: string): void {
  const msgContainer = document.querySelector('.js-2fa-msg-container') as HTMLElement | null;
  const msgText = document.querySelector('.js-2fa-msg') as HTMLElement | null;
  const msgDot = document.querySelector('.js-2fa-msg-dot') as HTMLElement | null;

  if (msgText) msgText.textContent = text;
  updatePassMsgDot(color, msgDot);
  toggleOpacity(msgContainer);
}

//Reset 2FA modal state
function reset2FAModal(): void {
  const verifyInput = document.querySelector('.js-2fa-verify-input') as HTMLInputElement | null;
  if (verifyInput) verifyInput.value = '';

  const msgContainer = document.querySelector('.js-2fa-msg-container') as HTMLElement | null;
  if (msgContainer) msgContainer.classList.add('opacity-0');
}

//Show 2FA login modal
export function show2FALoginModal(userId: number): void {
  pending2FAUserId = userId;
  const modal = document.querySelector('.js-2fa-login-modal') as HTMLElement | null;
  const input = document.querySelector('.js-2fa-login-input') as HTMLInputElement | null;
  const msgEl = document.querySelector('.js-2fa-login-msg') as HTMLElement | null;

  if (modal) modal.classList.remove('hidden');
  if (input) {
    input.value = '';
    input.focus();
  }
  if (msgEl) {
    msgEl.classList.add('hidden');
    msgEl.textContent = '';
  }
}

//Hide 2FA login modal
export function hide2FALoginModal(): void {
  pending2FAUserId = null;
  const modal = document.querySelector('.js-2fa-login-modal') as HTMLElement | null;
  if (modal) modal.classList.add('hidden');
}


//Verify 2FA token during login
export async function handleVerify2FALogin(): Promise<Promise<void>> {
  const input = document.querySelector('.js-2fa-login-input') as HTMLInputElement | null;
  const msgEl = document.querySelector('.js-2fa-login-msg') as HTMLElement | null;

  if (!input || !pending2FAUserId) return;

  const token = input.value.trim();
  if (token.length !== 6 || !/^\d{6}$/.test(token)) {
    if (msgEl) {
      msgEl.textContent = 'Please enter a valid 6-digit code';
      msgEl.classList.remove('hidden');
    }
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twoFactorToken: token,
        userId: pending2FAUserId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (msgEl) {
        msgEl.textContent = data.message || 'Invalid code';
        msgEl.classList.remove('hidden');
      }
      input.value = '';
      return;
    }

    // Login successful
    hide2FALoginModal();
    if (data.token) {
      localStorage.setItem('jwt_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('userName', data.user.username);
    }
    location.hash = '#welcome-page';
  } catch (err) {
    console.error('Error verifying 2FA login:', err);
    if (msgEl) {
      msgEl.textContent = 'Error verifying code';
      msgEl.classList.remove('hidden');
    }
  }
}

//Cancel 2FA login
export function handleCancel2FALogin(): void {
  hide2FALoginModal();
  location.hash = '#log-in-page';
}
