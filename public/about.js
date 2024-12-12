/**
 * about.js
 * 
 * This file handles functionality for the about page.
 */

/**
 * Checks if dark mode is enabled, based on localStorage, and enables it on the page if needed.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});