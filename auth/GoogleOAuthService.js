const { fetch } = require('undici');

class GoogleOAuthService {
  constructor({ clientId, clientSecret, redirectUri }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.tokenUrl = 'https://oauth2.googleapis.com/token';
    this.userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
    this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  }

  getConsentUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'profile email',
      access_type: 'offline',
      prompt: 'consent'
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  async getTokens(code) {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  async getUserInfo(accessToken) {
    const response = await fetch(this.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user info');
    return response.json();
  }
}

module.exports = GoogleOAuthService;