/**
 * howItWorks.js
 * 
 * This file handles functionality for the How It Works page.
 */

/**
 * Checks if dark mode is enabled, based on localStorage, and enables it on the page if needed.
 */
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});