import {
	clearUserMenuReturnHash,
	getUserMenuReturnHash
} from "./user-menu.js";
import {
	toggleOpacity
} from "./settings-page.js";

export function handleGoBackProfile() {
	const returnHash = getUserMenuReturnHash();
	clearUserMenuReturnHash();

	if (returnHash && returnHash !== location.hash) {
		location.hash = returnHash;
		return;
	}

	location.hash = '#welcome-page';
}

export async function initProfilePage() {

	try {
		const res = await fetch("http://localhost:3000/api/profile", {
			method: "GET",
			credentials: "include",
			headers: { "Content-Type": "application/json" }
		});

		if (!res.ok) {
      console.warn("Failed to load profile from server", res.status);
      return;
    }

		const data = await res.json();

		const user = data.user;
    if (!user) return;

		setText('.js-name', user.username);
    setText('.js-fullname', user.username);
    setText('.js-username', "@" + user.username.toLowerCase());
    setText('.js-username2', "@" + user.username.toLowerCase());
    setText('.js-email', user.email);
		setText('.js-wins', user.wins);
		setText('.js-total-games', user.total_games);

		const avatar = document.querySelector(
		".js-avatar") as HTMLElement | null;

		let url = '/assets/default_user.jpg';
		if (user.profile_picture) url = `/uploads/profiles/${user.profile_picture}`;
		if (avatar) setImage(url, avatar);

	} catch (err) {
		console.log(err);
	}
}

function setText(selector: string, value: string) {
	const el = document.querySelector(selector) as HTMLElement | null;
	if (el) el.textContent = value;
}

export function handleTogglePasswordModal() {
	const passModal = document.querySelector(
		'.js-pass-modal') as HTMLElement | null;

	if (!passModal) return;

	if (passModal.classList.contains('hidden')) {
		passModal.classList.remove('hidden');
		const first = passModal.querySelector(
			'input[type="password"]') as HTMLInputElement | null;
		first?.focus();
	} else {
		passModal.classList.add('hidden');
		passModal.querySelectorAll('input').forEach((i) => {i.value = ""});
	}
}

export async function handleUpdatePassword() {
	const passModal = document.querySelector(
		'.js-pass-modal') as HTMLElement | null;

	if (!passModal) return;

	const inputs = passModal.querySelectorAll(
		'input[type="password"]') as NodeListOf<HTMLInputElement>;

	const [current_p, new_p, confirm_p] = Array.from(inputs);

	if (!current_p || !new_p || !confirm_p) {
		updatePassMsg("Password inputs not found", "red");
		return;
	}

	if (!current_p.value || !new_p.value || !confirm_p.value) {
    updatePassMsg("Please fill all fields", "red");
    return;
  }

	if (new_p.value !== confirm_p.value) {
		updatePassMsg('Passwords do not match', 'red');
		return;
	}

	try {
		const res = await fetch("http://localhost:3000/api/profile/password", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache",
			},
			credentials: "include",
			body: JSON.stringify({
				currentPassword: current_p.value,
				newPassword: new_p.value,
			}),
		});

		let msg = '';
		try {
			const data = await res.json();
			if (data && data.message) msg = data.message;
		} catch {}

		if (!res.ok) {
			if (msg === '') msg = "Failed to update password";
			msg = msg.split(".")[0];
			updatePassMsg(msg, 'red');
		} else {
			if (msg === '') msg = 'Password updated';
			updatePassMsg(msg, 'green');
		}
	} catch {}
}

function updatePassMsg(text: string, color: string) {
	const msg = document.querySelector(
		'.js-pass-msg') as HTMLElement | null;
	const msg_dot = document.querySelector(
		'.js-pass-msg-dot') as HTMLElement | null;

	if (msg) msg.textContent = text;
	updatePassMsgDot(color, msg_dot);

	toggleOpacity(document.querySelector(
		'.js-pass-msg-container'));
}

export function updatePassMsgDot(color: string, el: HTMLElement | null) {
	if (!el) return;

	if (color === 'red')
		el.style.backgroundColor = 'rgb(239,68,68)';
	if (color === 'green')
		el.style.backgroundColor = 'rgb(34,197,94)';
}

export function initAvatarUpload() {
	const input = document.querySelector(
    ".js-avatar input[type='file']"
  ) as HTMLInputElement | null;
	const avatar = document.querySelector(
		".js-avatar") as HTMLElement | null;

	if (!input || !avatar) return;

	input.addEventListener("change", async () => {
		const file = input.files?.[0];
    if (!file) return;

		try {
			const url = await handleUploadProfileImage(file);
			if (url === '') throw new Error('Failed to upload an image.');

			const finalUrl = `${url}?t=${Date.now()}`;
			setImage(finalUrl, avatar);
		} catch (err) {
			console.error(err);
			setImage('/assets/default_user.jpg', avatar);
		} finally {
      input.value = "";
    }
	});
}

function setImage(url_image: string, el: HTMLElement) {
	el.style.backgroundImage = `url(${url_image})`;
	el.style.backgroundSize = "cover";
	el.style.backgroundPosition = "center";
}

async function handleUploadProfileImage(file: File) : Promise<string> {
	const allowed = ["image/jpeg", "image/png", "image/webp"];
	if (!allowed.includes(file.type)) {
		throw new Error("Only JPEG, PNG, or WebP images are allowed.");
	}

	const maxBytes = 5 * 1024 * 1024; // 5MB
	if (file.size > maxBytes) {
		throw new Error("Image is too large. Max size is 5MB.");
	}

	const fd = new FormData();
	fd.append("file", file);

	const res = await fetch("http://localhost:3000/api/profile/picture", {
		method: "PUT",
		credentials: "include",
		body: fd,
	});

	let url = '';
	try {
		const data = await res.json();
		if (data && data.url) url = data.url;
	} catch {}

	return res.ok ? url : "";
}

function toggleProfileEditUI() {
	const emailDiv = document.querySelector(
		'.js-email') as HTMLElement | null;
	const emailInput = document.querySelector(
		'.js-email-input') as HTMLInputElement | null;
	const fullnameDiv = document.querySelector(
		'.js-fullname') as HTMLElement | null;
	const fullnameInput = document.querySelector(
		'.js-fullname-input') as HTMLInputElement | null;
	const editBtn = document.querySelector(
		'.js-profile-edit') as HTMLElement | null;
	const saveCancelBtns = document.querySelector(
		'.js-profile-save-cancel-btns') as HTMLElement | null;

	if (!emailDiv || !emailInput
		|| !editBtn || !saveCancelBtns
		|| !fullnameDiv || !fullnameInput) return;

	emailDiv.classList.toggle('hidden');
	emailInput.classList.toggle('hidden');
	fullnameDiv.classList.toggle('hidden');
	fullnameInput.classList.toggle('hidden');

	editBtn.classList.toggle('hidden');
	saveCancelBtns.classList.toggle('hidden');
}

export function handleEditProfileData() {
	const emailDiv = document.querySelector(
		'.js-email') as HTMLElement | null;
	const emailInput = document.querySelector(
		'.js-email-input') as HTMLInputElement | null;
	const fullnameDiv = document.querySelector(
		'.js-fullname') as HTMLElement | null;
	const fullnameInput = document.querySelector(
		'.js-fullname-input') as HTMLInputElement | null;

	if (!emailDiv || !emailInput
		|| !fullnameDiv || !fullnameInput) return;

	emailInput.value = (emailDiv.textContent ?? "").trim();
	fullnameInput.value = (fullnameDiv.textContent ?? "").trim();

	toggleProfileEditUI();
}

export async function handleSaveProfileChange() {
	const emailInput = document.querySelector(
		'.js-email-input') as HTMLInputElement | null;
	const fullnameInput = document.querySelector(
		'.js-fullname-input') as HTMLInputElement | null;
	const emailDiv = document.querySelector(
		'.js-email') as HTMLElement | null;
	const fullnameDiv = document.querySelector(
		'.js-fullname') as HTMLElement | null;

	if (!emailInput || !fullnameInput
		|| !emailDiv || !fullnameDiv) return;

	const currentEmail = (emailDiv.textContent ?? "").trim();
  const currentFullname = (fullnameDiv.textContent ?? "").trim();

	const newEmail = emailInput.value.trim();
  const newFullname = fullnameInput.value.trim();

	if (!newEmail || !newEmail.includes("@")
		|| !newFullname) return;

	const fullnameChanged = newFullname !== currentFullname;
  const emailChanged = newEmail !== currentEmail;

	try {
		if (fullnameChanged) {
			const s = await updateFullname(newFullname);
			console.log(s);
		}
		if (emailChanged) {
			const s = await updateEmail(newEmail);
			console.log(s);
		}

		await initProfilePage();

		toggleProfileEditUI();
	} catch (err) {
		console.log(err);
	}
}

export function handleCancelProfileChange() {
	toggleProfileEditUI();
}

async function updateFullname(newUsername: string): Promise<string> {
	const res = await fetch("http://localhost:3000/api/profile/username", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newUsername }),
  });
	let msg = '';
	const data = await res.json();

	if (data && data.message) msg = data.message;

	if (!res.ok) throw new Error(msg || "Failed to update username");
	return msg;
}

async function updateEmail(newEmail: string): Promise<string> {
	const res = await fetch("http://localhost:3000/api/profile/email", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });
	let msg = '';
	const data = await res.json();

	if (data && data.message) msg = data.message;

	if (!res.ok) throw new Error(msg || "Failed to update email");
	return msg;
}

export function handleRemoveAvatar() {
	console.log(`use 'http://localhost:3000/api/profile/picture'
		API with an empty request body to remove the user avatar`);
}
