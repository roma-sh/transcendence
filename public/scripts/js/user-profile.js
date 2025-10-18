export function initUserProfilePage() {
    const profileSection = document.querySelector('#user-profile');
    if (!profileSection)
        return;
    const userName = localStorage.getItem('userName') || 'Guest';
    profileSection.innerHTML = `
    <div class="profile-container">
      <h2>Welcome here ${userName}</h2>
    </div>
  `;
}
