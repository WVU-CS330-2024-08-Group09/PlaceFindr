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
    let tempMultiplier = 1;
    let tempAdder = 0;


    function minSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $minTempPref.val(parseInt($maxTempPref.val()));
        }
        $minTempValue.text(Math.round(($minTempPref.val()-tempAdder)*tempMultiplier) + tempUnit);
        fillColor();
    }


    function maxSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $maxTempPref.val(parseInt($minTempPref.val()));
        }
        $maxTempValue.text(Math.round(($maxTempPref.val()-tempAdder)*tempMultiplier) + tempUnit);
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
    let precipMultiplier = 1;

    const $humidInput = $('#humidPref'); 
    const $humidValue = $('#humidValue');

    let humidUnit = '%'

    $precipInput.on('input', updatePrecip);
    function updatePrecip(){
        $precipValue.text(Math.round(($precipInput).val()*precipMultiplier) + precipUnit);
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
            precipMultiplier = 1;
            tempAdder = 0;
            tempMultiplier = 1;
        }
        else if(metUnitButton.is(':checked')){
            tempUnit ='°C';
            precipUnit = ' mm'
            precipMultiplier = 25.4;
            tempAdder = 32;
            tempMultiplier = 5/9;
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


    const prefTab = $('#prefTab');
    const settingsTab = $('#prefSettings');
    const prefTabButton = $('#prefTabButton');
    const settTabButton = $('#prefSettTabButton');


    prefTabButton.on('click', function(){
        if(prefTab.hasClass('tab')){
            prefTab.toggleClass('tab active');
            settingsTab.toggleClass('tab active');
        }
    });

    settTabButton.on('click', function(){
        if(settingsTab.hasClass('tab')){
            prefTab.toggleClass('tab active');
            settingsTab.toggleClass('tab active');
        }
    });

    $('#searchButton').on('click', function(){
        updateHeatmap();
    })

});

