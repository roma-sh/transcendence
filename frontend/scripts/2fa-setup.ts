import { authenticatedFetch, getToken } from './jwt-utils.js';

/**
 * Initialize 2FA setup functionality
 */
export function init2FASetup(): void {
  const setupContainer = document.getElementById('2fa-setup-container');
  const statusContainer = document.getElementById('2fa-status-container');
  const statusText = document.getElementById('2fa-status');
  const enableButton = document.getElementById('2fa-enable-button');
  const cancelButton = document.getElementById('2fa-cancel-button');
  const verifyButton = document.getElementById('2fa-verify-button');
  const verifyCodeInput = document.getElementById('2fa-verify-code') as HTMLInputElement;
  const qrCodeImg = document.getElementById('2fa-qr-code') as HTMLImageElement;
  const secretText = document.getElementById('2fa-secret-text');
  const enabledContainer = document.getElementById('2fa-enabled-container');
  const disableButton = document.getElementById('2fa-disable-button');

  // Check 2FA status on page load and when settings page is shown
  check2FAStatus();
  
  // Also check when hash changes to settings page
  const handleHashChange = () => {
    if (location.hash === '#settings-page') {
      check2FAStatus();
    }
  };
  window.addEventListener('hashchange', handleHashChange);

  // Enable 2FA button
  enableButton?.addEventListener('click', async () => {
    await setup2FA();
  });

  // Cancel setup
  cancelButton?.addEventListener('click', () => {
    hideSetup();
    check2FAStatus();
  });

  // Verify and enable 2FA
  verifyButton?.addEventListener('click', async () => {
    const code = verifyCodeInput?.value.trim();
    if (!code || code.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }
    await verifyAndEnable2FA(code);
  });

  // Disable 2FA
  disableButton?.addEventListener('click', async () => {
    if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      await disable2FA();
    }
  });

  /**
   * Check if user has 2FA enabled
   */
  async function check2FAStatus(): Promise<void> {
    const token = getToken();
    if (!token) {
      // Not logged in - hide 2FA section
      if (statusText) statusText.textContent = 'Please log in to manage 2FA';
      if (enableButton) enableButton.style.display = 'none';
      if (enabledContainer) enabledContainer.style.display = 'none';
      if (setupContainer) setupContainer.style.display = 'none';
      return;
    }

    if (statusText) {
      statusText.textContent = 'Checking...';
    }

    try {
      const response = await authenticatedFetch('http://127.0.0.1:3000/api/auth/2fa/status', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to check 2FA status');
      }

      const result = await response.json();
      const isEnabled = result.enabled === true;

      // Update UI based on status
      if (isEnabled) {
        // 2FA is enabled
        if (statusText) statusText.textContent = 'Enabled';
        if (enableButton) enableButton.style.display = 'none';
        if (enabledContainer) enabledContainer.style.display = 'block';
        if (setupContainer) setupContainer.style.display = 'none';
      } else {
        // 2FA is not enabled
        if (statusText) statusText.textContent = 'Not enabled';
        if (enableButton) enableButton.style.display = 'block';
        if (enabledContainer) enabledContainer.style.display = 'none';
        if (setupContainer) setupContainer.style.display = 'none';
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      if (statusText) statusText.textContent = 'Error checking status';
      // Show enable button as fallback
      if (enableButton) enableButton.style.display = 'block';
      if (enabledContainer) enabledContainer.style.display = 'none';
      if (setupContainer) setupContainer.style.display = 'none';
    }
  }

  /**
   * Setup 2FA - Generate secret and QR code
   */
  async function setup2FA(): Promise<void> {
    const token = getToken();
    if (!token) {
      alert('Please log in first. You need to be logged in to enable 2FA.');
      location.hash = '#log-in-page';
      return;
    }
    
    console.log('Token found, length:', token.length);

    try {
      console.log('Setting up 2FA, token:', token ? 'exists' : 'missing');
      const response = await authenticatedFetch('http://127.0.0.1:3000/api/auth/2fa/setup', {
        method: 'POST',
        body: JSON.stringify({}), // Empty body to ensure proper request format
      });

      console.log('2FA setup response status:', response.status);
      
      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch (e) {
          const text = await response.text();
          console.error('Failed to parse error response:', text);
          throw new Error(`Server error: ${response.status} - ${text}`);
        }
        console.error('2FA setup error:', error);
        throw new Error(error.error || error.message || 'Failed to setup 2FA');
      }

      const result = await response.json();

      // Show QR code and secret
      if (qrCodeImg && result.qr_code) {
        qrCodeImg.src = result.qr_code;
      }
      if (secretText && result.secret) {
        secretText.textContent = result.secret;
      }

      // Show setup container
      if (setupContainer) setupContainer.style.display = 'block';
      if (enableButton) enableButton.style.display = 'none';
      if (statusText) statusText.textContent = 'Setup in progress...';
      if (verifyCodeInput) {
        verifyCodeInput.value = '';
        verifyCodeInput.focus();
      }
    } catch (error: any) {
      console.error('2FA setup error:', error);
      alert(error.message || 'Failed to setup 2FA. Please try again.');
    }
  }

  /**
   * Verify 2FA code and enable it
   */
  async function verifyAndEnable2FA(code: string): Promise<void> {
    const token = getToken();
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await authenticatedFetch('http://127.0.0.1:3000/api/auth/2fa/verify-setup', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid verification code');
      }

      alert('2FA enabled successfully!');
      hideSetup();
      // Refresh status to update UI
      await check2FAStatus();
    } catch (error: any) {
      console.error('2FA verify error:', error);
      alert(error.message || 'Failed to verify code. Please try again.');
      if (verifyCodeInput) {
        verifyCodeInput.value = '';
        verifyCodeInput.focus();
      }
    }
  }

  /**
   * Disable 2FA
   */
  async function disable2FA(): Promise<void> {
    const token = getToken();
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await authenticatedFetch('http://127.0.0.1:3000/api/auth/2fa/disable', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to disable 2FA');
      }

      alert('2FA disabled successfully');
      await check2FAStatus();
    } catch (error: any) {
      console.error('2FA disable error:', error);
      alert(error.message || 'Failed to disable 2FA. Please try again.');
    }
  }

  /**
   * Hide setup container
   */
  function hideSetup(): void {
    if (setupContainer) setupContainer.style.display = 'none';
    if (verifyCodeInput) verifyCodeInput.value = '';
  }
}

