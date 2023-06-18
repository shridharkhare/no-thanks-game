// Theme switcher
const darkModeButton = document.getElementById('theme-button');

const theme = document.documentElement.getAttribute('data-theme');

// Set the button text according to the current theme
darkModeButton.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
});