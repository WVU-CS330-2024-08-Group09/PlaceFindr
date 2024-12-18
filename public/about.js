/**
 * about.js
 * 
 * This file handles functionality for the about page.
 */

/**
 * Checks if dark mode is enabled, based on localStorage, and enables it on the page if needed.
 */
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('no-transition');
        document.body.classList.add('dark-mode');
        
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 10);
    }
});