import { apiHeaders } from "./api-config.js";
import { escapeHTML } from "./game.js";

export async function initUserProfilePage(): Promise<void> {
  const profileSection = document.querySelector('#user-profile') as HTMLElement;
  if (!profileSection) return;

  try {
    // Fetch user profile from server
    const response = await fetch('/api/profile', {
      method: 'GET',
      credentials: 'include',
      headers: apiHeaders(),
    });

    // Parse JSON
    const data = await response.json();

    // If not logged in or request fails, show Guest
    if (!data.success || !data.user) {
      profileSection.innerHTML = `
        <div class="profile-container">
          <h2>did not get the data first error .. Welcome Guest</h2>
        </div>
      `;
      return;
    }

    const userName = data.user.username || 'Guest from or';

    // Update HTML with username + green online dot
    profileSection.innerHTML = `
      <div class="profile-container flex items-center gap-2">
        <h2>Welcome here <span class="username"></span></h2>
        <span class="w-3 h-3 rounded-full bg-green-500" title="Online"></span>
      </div>
    `;

    const span = profileSection.querySelector('.username');
    if (span) span.textContent = escapeHTML(userName);

  } catch (err) {
    profileSection.innerHTML = `
      <div class="profile-container">
        <h2>Error: Welcome Guest</h2>
      </div>
    `;
  }
}

