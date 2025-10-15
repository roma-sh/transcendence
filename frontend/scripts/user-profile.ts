export function initUserProfilePage(): void {
  const profileSection = document.querySelector('#user-profile') as HTMLElement;
  if (!profileSection) return;

  const userName = localStorage.getItem('userName') || 'Guest';

  profileSection.innerHTML = `
    <div class="profile-container">
      <h2>Welcome here ${userName}</h2>
    </div>
  `;
}
