//CAN'T IMPORT BECAUSE IT USES require WHICH ONLY WORKS THROUGH node.js
//NEED TO FIGURE SOME SOLUTION OUT
//import {emailStored, validLogin, newUser} from "./Account.js";

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
    window.minSlide = minSlide

    function maxSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $maxTempPref.val(parseInt($minTempPref.val()));
        }
        $maxTempValue.text(Math.round(($maxTempPref.val()-tempAdder)*tempMultiplier) + tempUnit);
        fillColor();
    }
    window.maxSlide = maxSlide

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
    let humidUnit = '%';

    const newInput = $('#newPref');
    const newValue = $('#newValue');
    let newUnit = '';

    $precipInput.on('input', updatePrecip);
    function updatePrecip(){
        $precipValue.text(Math.round(($precipInput).val()*precipMultiplier) + precipUnit);
    };

    $humidInput.on('input', updateHumid);
    function updateHumid(){
        $humidValue.text($($humidInput).val() + humidUnit);
    };

    newInput.on('input', updateNew);
    function updateNew(){
        newValue.text($(newInput).val() + newUnit);
    }

    //$precipValue.text($($precipInput).val() + precipUnit);
    //$humidValue.text($($humidInput).val() + humidUnit);
    updatePrecip();
    updateHumid();
    updateNew();

    const impUnitButton = $('#impUnitButton');
    const metUnitButton = $('#metUnitButton');
    const saveSettButton = $('#saveSettingButton')

    saveSettButton.on('click',function(){
        if(impUnitButton.is(':checked')){
            localStorage.setItem('prefUnits','imp')
        }
        else if(metUnitButton.is(':checked')){
            localStorage.setItem('prefUnits','met')
        }
        updateUnits();
    });
    function updateUnits(){
        if(localStorage.getItem('prefUnits')==='imp'){
            tempUnit = '°F';
            precipUnit = ' in';
            precipMultiplier = 1;
            tempAdder = 0;
            tempMultiplier = 1;
            impUnitButton.prop('checked',true);
        }
        else if(localStorage.getItem('prefUnits')==='met'){
            tempUnit ='°C';
            precipUnit = ' mm'
            precipMultiplier = 25.4;
            tempAdder = 32;
            tempMultiplier = 5/9;
            metUnitButton.prop('checked',true);
        }
        minSlide();
        maxSlide();
        updateHumid();
        updatePrecip();
    }
    updateUnits();

    


    // Navigates to the account page
    document.getElementById("aboutBtn").addEventListener("click", function() {
        window.location.href = "About.html"; 
    });

    //navigates to the saved page
    document.getElementById("savedBtn").addEventListener("click", function(){
        window.location.href = 'saved.html';
    })
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
            prefTab.toggleClass('tab active');
            settingsTab.toggleClass('tab active');
            prefTabButton.css('background-color', 'lightgray');
            settTabButton.css('background-color', 'rgb(160, 154, 154)');
        }
    });

    settTabButton.on('click', function(){
        if(settingsTab.hasClass('tab')){
            prefTab.toggleClass('tab active');
            settingsTab.toggleClass('tab active');
            prefTabButton.css('background-color', 'rgb(160, 154, 154)');
            settTabButton.css('background-color', 'lightgray');
        }
    });
    //create a heatmap with the preferences set by the user
    $('#searchButton').on('click', function(){
        updateHeatmap();
    })

    //save the current heatmap
    $('#saveButton').on('click', function(){
        savePreference()
    })

    $('#loadButton').on('click', function(){
        setPreference()
    })

});
