import {
  updateUIForAuthState,
  updateUIforUserMenu,
} from "./user-menu.js";

export async function setInitHash() {
  const isLoggedIn = await isUserOnline();
  if (!location.hash || !isLoggedIn) {
    location.hash = '#welcome-page';
  }
}

export function initWelcomePage() {
	updateUIForAuthState();
	updateUIforUserMenu();
}

export function handleGoBackChooseMode() {
  location.hash = '#welcome-page';
}

export function handleOpenChooseMode() {
  location.hash = '#choose-mode-page';
}

export function handleOpenSignUp() {
  location.hash = '#sign-up-page';
}

export function handleOpenLogIn() {
  location.hash = '#log-in-page';
}

// // Διατηρούμε τις μεταβλητές εκτός για να λειτουργούν ως cache
// let lastCheckTime = 0;
// let cachedStatus = false;

// export async function isUserOnline(): Promise<boolean> {
//   const now = Date.now();
  
//   // 1. Έλεγχος Cache: Αν έχουν περάσει λιγότερα από 2 δευτερόλεπτα, επέστρεψε την τελευταία γνωστή κατάσταση
//   if (now - lastCheckTime < 2000) {
//     return cachedStatus;
//   }

//   try {
//     const res = await fetch('/api/useronline', { 
//       method: 'GET',
//       credentials: 'include', // Απαραίτητο για τα cookies
//     });

//     // 2. Διαχείριση 401: Ο server λέει ρητά ότι δεν υπάρχει ενεργό session
//     if (res.status === 401) {
//         console.warn("User session expired or not logged in.");
//         cachedStatus = false;
//         lastCheckTime = now;
//         localStorage.removeItem('userName'); // Καθαρίζουμε το όνομα αφού δεν είναι πια online
//         return false;
//     }

//     // 3. Διαχείριση άλλων σφαλμάτων (π.χ. 500, 404)
//     if (!res.ok) {
//         cachedStatus = false;
//         lastCheckTime = now;
//         return false;
//     }
    
//     // 4. Επιτυχής κλήση
//     const data = await res.json();
//     cachedStatus = !!data.online; // Μετατροπή σε boolean
//     lastCheckTime = now;

//     if (data.online && data.username) {
//         localStorage.setItem('userName', data.username);
//     } else {
//         localStorage.removeItem('userName');
//     }

//     return cachedStatus; 
//   } catch (err) {
//     // 5. Network Error (π.χ. ο server είναι κλειστός)
//     console.error('Connection error(isUserOnline function):', err);
//     return false;
//   }
// }

export async function isUserOnline(): Promise<true | false> {
  try {
    const res = await fetch('/api/useronline', { 
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

	if (res.status === 401) {
		// Αντί για error, απλά γύρισε ότι ο χρήστης δεν είναι συνδεδεμένος
		console.warn("User session expired or not logged in.");
		return false;
	}

	if (!res.ok)
    return false;
    
    const data = await res.json();

    if (data.online && data.username) {
        localStorage.setItem('userName', data.username);
    }

    return data.online; 
  } catch (err) {
    console.error('Connection error(isUserOnline function):', err);
    return false;
  }
}

