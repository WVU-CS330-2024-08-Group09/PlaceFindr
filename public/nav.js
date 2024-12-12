/**
 * nav.js
 * 
 * This file controls the functionality of the nav bar used throughout the site.
 */

/**
 * Initializes the navigation buttons on page load.
 *
 * This function waits for the DOM to be fully loaded and then assigns jQuery objects
 * to the four nav bar buttons. Event listeners are attached to each button to
 * redirect the user to the corresponding page when clicked.
 */
$(document).ready(function() 
{
    //create jQuery objects for the 4 nav bar nuttons
    let $homeBtn = $(".homeBtn")
    let $howtoBtn = $(".howToBtn")
    let $savedBtn = $(".savedBtn")
    let $aboutBtn = $(".aboutBtn")


    $homeBtn.on("click", function(){
        window.location.href = './index.html';
    })

    $savedBtn.on("click", function(){
        window.location.href = './saved.html'
    })

    $howtoBtn.on("click", function(){
        window.location.href = './howItWorks.html'
    })

    $aboutBtn.on("click", function(){
        window.location.href = './About.html'
    })
});

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
