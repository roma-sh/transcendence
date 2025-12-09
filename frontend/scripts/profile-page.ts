export function handleGoBackProfile() {
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
