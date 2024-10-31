$(document).ready(function() {

    // Function for toggling Dark/Light Mode
    const darkToggle = document.getElementById('darkModeToggle');

    // Check localStorage for dark mode setting on page load
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save dark mode preference in localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Functions for changing each input for the Preference Sliders

    let $minTempPref = $('#minTempPref');
    let $maxTempPref = $('#maxTempPref');
    let $minTempValue = $('#minTempValue');
    let $maxTempValue = $('#maxTempValue');
    let minGap = 1;
    const sliderRange = $('#slider-range');
    const maxTemp = $maxTempPref.attr('max');

    function minSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $minTempPref.val(parseInt($maxTempPref.val()));
        }
        $minTempValue.text($minTempPref.val());
        fillColor();
    }


    function maxSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $maxTempPref.val(parseInt($minTempPref.val()));
        }
        $maxTempValue.text($maxTempPref.val());
        fillColor();
    }

    function fillColor(){
        const percentMin = (($minTempPref.val()-20) / (maxTemp-20)) *100;
        const percentMax = (($maxTempPref.val()-20) / (maxTemp-20)) *100;
        sliderRange.css({
            left: `${percentMin}%`,
            width:`${percentMax-percentMin}%`
        })
        
    }
    minSlide();
    maxSlide();
    fillColor();

    $minTempPref.on('input',minSlide);
    $maxTempPref.on('input',maxSlide);

    const $precipInput = $('#precipPref');
    const $precipValue = $('#precipValue');

    const $humidInput = $('#humidPref');
    const $humidValue = $('#humidValue');

    $precipInput.on('input', function(){
        $precipValue.text($(this).val());
    });

    $humidInput.on('input', function() {
        $humidValue.text($(this).val());
    });

    // Navigates to the account page
    document.getElementById("accountBtn").addEventListener("click", function() {
        window.location.href = "Account.html"; 
    });

    // Form handling for Login and Register
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
    
        // Handle login logic (you can integrate this with backend or display validation)
        const email = $('#email').val();
        const password = $('#password').val();
        $('#loginMessage').text(`Logging in with ${email}...`);
    });

    $('#registerForm').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
    
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
    
        if (password !== confirmPassword) {
            $('#registerMessage').text('Passwords do not match!');
        } else {
            $('#registerMessage').text(`Registering ${firstName} ${lastName}...`);
            // Registration logic goes here (e.g., send data to server)
        }
    });

});
