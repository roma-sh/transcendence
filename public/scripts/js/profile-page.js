export function initProfilePage() {
    const profileBackBtn = document.querySelector('.js-profile__back_btn');
    profileBackBtn.addEventListener("click", () => {
        location.hash = 'welcome-page';
    });
    const name = localStorage.getItem('userName');
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
function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el)
        el.textContent = value;
}
function on(selector, event, handler) {
    const el = document.querySelector(selector);
    if (el)
        el.addEventListener(event, handler);
}
function firstWord(text) {
    return (text.match(/\S+/)?.[0]) || '';
}
function initials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(s => s[0].toUpperCase())
        .join('');
}
