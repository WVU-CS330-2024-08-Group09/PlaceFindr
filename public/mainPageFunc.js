//CAN'T IMPORT BECAUSE IT USES require WHICH ONLY WORKS THROUGH node.js
//NEED TO FIGURE SOME SOLUTION OUT
//import {emailStored, validLogin, newUser} from "./Account.js";
import { querryPoints, savePreference, setPreference} from './map.js';


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
    let $avgTempPref = $('#avgTempPref'); 
    let $avgTempValue = $('#avgTempValue');
    let $precipPref = $('#precipPref');
    let $precipValue = $('#precipValue');
    let minGap = 1;
    const sliderRange = $('#slider-range');
    let maxTemp = $maxTempPref.attr('max');
    let minTemp = $minTempPref.attr('min')

    // Display and internal unit variables
    let displayTempUnit = '°F';  // For display only
    let internalTempUnit = '°C'; // Always Celsius internally
    let displayPrecipUnit = ' in';
    let internalPrecipUnit = ' mm';
    let displayMultiplier = 1;
    let displayTempAdder = 0;
    let displayPrecipMultiplier = 1;

    function minSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $minTempPref.val(parseInt($maxTempPref.val()));
        }
        // Convert for display only, keeping internal value in Celsius
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($minTempPref.val() * 9/5) + 32).toFixed(1) 
            : $minTempPref.val();
        $minTempValue.text(Math.round(displayValue) + displayTempUnit);
        fillColor();
    }
    window.minSlide = minSlide

    function maxSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $maxTempPref.val(parseInt($minTempPref.val()));
        }
        // Convert for display only, keeping internal value in Celsius
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($maxTempPref.val() * 9/5) + 32).toFixed(1) 
            : $maxTempPref.val();
        $maxTempValue.text(Math.round(displayValue) + displayTempUnit);
        fillColor();
    }
    window.maxSlide = maxSlide

    
    function fillColor() {
        let minVal = parseInt($minTempPref.val());
        let maxVal = parseInt($maxTempPref.val());
        
        const percentMin = ((minVal - minTemp) / (maxTemp - minTemp)) * 100;
        const percentMax = ((maxVal - minTemp) / (maxTemp - minTemp)) * 100;
        
        sliderRange.css({
            'left': percentMin + '%',
            'width': (percentMax - percentMin) + '%'
        });
    }

    fillColor();


    // event listeners for preferences
    $minTempPref.on('change', function() {
      querryPoints();
      minSlide();
    });
    $maxTempPref.on('change', function() {
      querryPoints();
      maxSlide();
    });
    $avgTempPref.on('change', function() {
      querryPoints();
      updateAvgTemp();
    });
    $precipPref.on('change', function() {
      querryPoints();
      updatePrecip();
    });
    const seasonSelect = document.getElementById('season');
    seasonSelect.addEventListener('change', function() {
      querryPoints(); 
    });
    
    function updatePrecip(){
        // Convert for display only, keeping internal value in mm
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? ($precipPref.val() / 25.4).toFixed(2) 
            : $precipPref.val();
        $precipValue.text(Math.round(displayValue * 10) / 10 + displayPrecipUnit);
    }

    function updateAvgTemp(){
        // Convert for display only, keeping internal value in Celsius
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($avgTempPref.val() * 9/5) + 32).toFixed(1) 
            : $avgTempPref.val();
        $avgTempValue.text(Math.round(displayValue) + displayTempUnit);
    }

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
            displayTempUnit = '°F';
            displayPrecipUnit = ' in';
            displayPrecipMultiplier = 1/25.4;  // Convert mm to inches for display
            displayTempAdder = 32;
            displayMultiplier = 9/5;  // Convert Celsius to Fahrenheit for display
            impUnitButton.prop('checked',true);
        }
        else if(localStorage.getItem('prefUnits')==='met'){
            displayTempUnit = '°C';
            displayPrecipUnit = ' mm';
            displayPrecipMultiplier = 1;
            displayTempAdder = 0;
            displayMultiplier = 1;
            metUnitButton.prop('checked',true);
        }
        minSlide();
        maxSlide();
        updatePrecip();
        updateAvgTemp();
    }
    updateUnits();



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
        querryPoints();
    })

    //save the current heatmap
    $('#saveButton').on('click', function(){
        savePreference()
    })

    $('#loadButton').on('click', function(){
        setPreference()
    })

});
