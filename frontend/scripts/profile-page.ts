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

export function initProfilePage() {
	const name = localStorage.getItem('userName') as string;

	setText('.js-name', name);
	setText('.js-fullname', name);

	const uname = '@' + firstWord(name).toLowerCase();
	setText('.js-username', uname);
	setText('.js-username2', uname);

	const email = `${firstWord(name).toLowerCase()}@example.com`;
	setText('.js-email', email);

	setText('.js-avatar', initials(name));
}

function setText(selector: string, value: string) {
	const el = document.querySelector(selector) as HTMLElement | null;
	if (el) el.textContent = value;
}

function firstWord(text: string) {
	return (text.match(/\S+/)?.[0]) || '';
}

function initials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map(s => s[0]!.toUpperCase())
		.join('');
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
		const res = await fetch("/api/profile/password", {
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
			if (msg.includes('Weak password')) msg = 'Weak password';
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

	if (msg) msg.textContent = text;
	updatePassMsgDot(color);

	toggleOpacity(document.querySelector(
		'.js-pass-msg-container'));
}

function updatePassMsgDot(color: string) {
	const msg_dot = document.querySelector(
		'.js-pass-msg-dot') as HTMLElement | null;

	if (!msg_dot) return;

	if (color === 'red')
		msg_dot.style.backgroundColor = 'rgb(239,68,68)';
	if (color === 'green')
		msg_dot.style.backgroundColor = 'rgb(34,197,94)';
}
