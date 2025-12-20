// export function initUserProfilePage(): void {
//   const profileSection = document.querySelector('#user-profile') as HTMLElement;
//   if (!profileSection) return;

//   const userName = localStorage.getItem('userName') || 'Guest';

//   profileSection.innerHTML = `
//     <div class="profile-container">
//       <h2>Welcome here ${userName}</h2>
//     </div>
//   `;
// }

export async function initUserProfilePage(): Promise<void> {
  const profileSection = document.querySelector('#user-profile') as HTMLElement;
  if (!profileSection) return;

  try {
    // Fetch user profile from server
    const response = await fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      credentials: 'include',
    });

    // If not logged in or request fails, show Guest
    if (!response.ok) {
      profileSection.innerHTML = `
        <div class="profile-container">
          <h2>did not get the data first error .. Welcome Guest</h2>
        </div>
      `;
      return;
    }

    // Parse JSON
    const data = await response.json();
    const userName = data.user?.username || 'Guest from or';

    // Update HTML with username + green online dot
    profileSection.innerHTML = `
      <div class="profile-container flex items-center gap-2">
        <h2>Welcome here ${userName}</h2>
        <span class="w-3 h-3 rounded-full bg-green-500" title="Online"></span>
      </div>
    `;
  } catch (err) {
    console.error('Error fetching profile:', err);
    profileSection.innerHTML = `
      <div class="profile-container">
        <h2>Error: Welcome Guest</h2>
      </div>
    `;
  }
}

