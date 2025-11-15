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

	on('.js-edit', 'click', () => alert('Edit profile (hook up later)'));
	on('.js-change-pass', 'click', () => alert('Change password (hook up later)'));
	on('.js-logout', 'click', () => alert('Log out (hook up later)'));
}

function setText(selector: string, value: string) {
	const el = document.querySelector(selector) as HTMLElement | null;
	if (el) el.textContent = value;
}

function on(selector: string, event: string, handler: (e: Event) => void) {
	const el = document.querySelector(selector);
	if (el) el.addEventListener(event, handler);
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
