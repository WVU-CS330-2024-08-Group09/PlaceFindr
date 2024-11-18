//wait for the page to be fully loaded to assign any variables
$(document).ready(function() 
{
    //create jQuery objects for the 4 nav bar nuttons
    let $homeBtn = $("#homeBtn")
    let $howtoBtn = $("#howToBtn")
    let $savedBtn = $("#savedBtn")
    let $accountBtn = $("#accountBtn")


    $homeBtn.on("click", function(){
        window.location.href = 'PlaceFindr.html';
    })

    $savedBtn.on("click", function(){
        window.location.href = 'saved.html'
    })

    $howtoBtn.on("click", function(){
        window.location.href = 'howTo.html'
    })

    $accountBtn.on("click", function(){
        window.location.href = 'account.html'
    })
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
});


