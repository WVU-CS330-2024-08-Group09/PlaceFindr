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
    let maxTemp = $maxTempPref.attr('max');
    let minTemp = $minTempPref.attr('min')
    let tempUnit = '°F';


    function minSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $minTempPref.val(parseInt($maxTempPref.val()));
        }
        $minTempValue.text($minTempPref.val() + tempUnit);
        fillColor();
    }


    function maxSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $maxTempPref.val(parseInt($minTempPref.val()));
        }
        $maxTempValue.text($maxTempPref.val() + tempUnit);
        fillColor();
    }

    function fillColor(){
        const percentMin = (($minTempPref.val()-minTemp) / (maxTemp-minTemp)) *100;
        const percentMax = (($maxTempPref.val()-minTemp) / (maxTemp-minTemp)) *100;
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
    let precipUnit = ' in'

    const $humidInput = $('#humidPref'); 
    const $humidValue = $('#humidValue');

    let humidUnit = '%'

    $precipInput.on('input', updatePrecip);
    function updatePrecip(){
        $precipValue.text($($precipInput).val() + precipUnit);
    };

    $humidInput.on('input', updateHumid);
    function updateHumid(){
        $humidValue.text($($humidInput).val() + humidUnit);
    };

    $precipValue.text($($precipInput).val() + precipUnit);
    $humidValue.text($($humidInput).val() + humidUnit);

    const impUnitButton = $('#impUnitButton');
    const metUnitButton = $('#metUnitButton');
    const saveSettButton = $('#saveSettingButton')

    saveSettButton.on('click',function(){
        if(impUnitButton.is(':checked')){
            tempUnit = '°F';
            precipUnit = ' in';
            $maxTempPref.attr('max') = 80;
            $maxTempPref.attr('min') = 20;
        }
        else if(metUnitButton.is(':checked')){
            tempUnit = '°C';
            precipUnit = ' mm'
        }
        minSlide();
        maxSlide();
        updateHumid();
        updatePrecip();

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

        //TODO: FIX BROKEN, SORRY
        // //TODO: Add some form of encryption on the password before passing it to the validLogin function
        // //Check if the login info is valid
        // var validAndName = validLogin(email, password);
        // if(validAndName[0]){
        //     $('#loginMessage').text(`Valid email and password! Hello ${validAndName[1]}`);
        //     // TODO: Add whatever else should happen after logging in, probably also return preferences somehow?
        // }
        // else{
        //     $('#loginMessage').text(`No account exists with this email and password`);
        // }
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
            //TODO: FIX BROKEN, SORRY
            // if(emailStored(email)){
            //     $('#registerMessage').text('This email is already in use.');
            // }
            // else{
            //     //TODO: Add some form of encryption on the password before passing it to the newUser function
            //     newUser(firstName, lastName, email, password);
            //     $('#registerMessage').text('Congratulations, your account has been registered! You can now login!');
            // }
        }
    });


    const prefTab = $('#prefTab');
    const settingsTab = $('#prefSettings');
    const prefTabButton = $('#prefTabButton');
    const settTabButton = $('#prefSettTabButton');


    prefTabButton.on('click', function(){
        if(prefTab.hasClass('tab')){
            prefTab.toggleClass('tab');
            settingsTab.toggleClass('tab');
        }
    });

    settTabButton.on('click', function(){
        if(settingsTab.hasClass('tab')){
            prefTab.toggleClass('tab');
            settingsTab.toggleClass('tab');
        }
    });

    $('#searchButton').on('click', function(){
        updateHeatmap();
    })

});

