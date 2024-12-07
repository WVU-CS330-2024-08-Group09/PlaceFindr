//CAN'T IMPORT BECAUSE IT USES require WHICH ONLY WORKS THROUGH node.js
//NEED TO FIGURE SOME SOLUTION OUT
//import {emailStored, validLogin, newUser} from "./Account.js";
import { querryPoints, savePreference, setPreference} from './map.js';

$(document).ready(function() {

//**** All Variable Declarations ****//

    // dark mode toggle declaration
    const darkToggle = $('#darkModeToggle');
    //for season selection
    const seasonSelect = $('#season');
    //double slider min/max temp
    const $minTempPref = $('#minTempPref');
    const $maxTempPref = $('#maxTempPref');
    const $minTempValue = $('#minTempValue');
    const $maxTempValue = $('#maxTempValue');
    const sliderRange = $('#slider-range');
    //attributes for the double slider
    const minGap = 1;
    const maxTemp = $maxTempPref.attr('max');
    const minTemp = $minTempPref.attr('min');
    //avg temp
    const $avgTempPref = $('#avgTempPref'); 
    const $avgTempValue = $('#avgTempValue');
    //precipitation
    const $precipPref = $('#precipPref');
    const $precipValue = $('#precipValue');
    //for Unit display
    let displayTempUnit = '°F';  
    let displayPrecipUnit = ' in';
    //for Unit Conversion Radio Buttons
    const impUnitButton = $('#impUnitButton');
    const metUnitButton = $('#metUnitButton');
    //Save settings Button
    const saveSettButton = $('#saveSettingButton');
    //for tabs in prefernces section
    const prefTab = $('#prefTab');
    const settingsTab = $('#prefSettings');
    const prefTabButton = $('#prefTabButton');
    const settTabButton = $('#prefSettTabButton');
    //Buttons in pref Section
    const searchButton = $('#searchButton');
    const loadButton = $('#loadButton');
    const saveButton = $('#saveButton');

    //creates global variables for the map.js file
    window.minSlide = minSlide;
    window.maxSlide = maxSlide;

    //initialize all event handlers
    darkToggle.on('click', toggleDarkMode);
    $minTempPref.on('input', minSlide);
    $maxTempPref.on('input', maxSlide);
    $avgTempPref.on('input',updateAvgTemp);
    $precipPref.on('input',updatePrecip);
    seasonSelect.on('change',querryPoints);
    prefTabButton.on('click', toggleTabs(prefTab,settingsTab,prefTabButton,settTabButton));
    settTabButton.on('click', toggleTabs(settingsTab,prefTab,settTabButton,prefTabButton));
    saveSettButton.on('click',updateSettings);
    searchButton.on('click', querryPoints);
    saveButton.on('click', savePreference);
    loadButton.on('click', setPreference);
    
    
    ///*** All function declarations ***///

    //dark mode toggling function
    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    }
    
    //functions for updating the double sliders
    //min Slider
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
    //max Slider
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
    //updating the fill between thumbs for double sliders
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
    
    //function for updating precipitation
    function updatePrecip(){
        // Convert for display only, keeping internal value in mm
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? ($precipPref.val() / 25.4).toFixed(2) 
            : $precipPref.val();
        $precipValue.text(Math.round(displayValue * 10) / 10 + displayPrecipUnit);
    }

    //function for updating Avg Temp
    function updateAvgTemp(){
        // Convert for display only, keeping internal value in Celsius
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($avgTempPref.val() * 9/5) + 32).toFixed(1) 
            : $avgTempPref.val();
        $avgTempValue.text(Math.round(displayValue) + displayTempUnit);
    }

    //function to update the settings
    function updateSettings(){
        if(impUnitButton.is(':checked')){
            localStorage.setItem('prefUnits','imp')
        }
        else if(metUnitButton.is(':checked')){
            localStorage.setItem('prefUnits','met')
        }
        updateUnits();
    }

    //function to update units
    function updateUnits(){
        const unit = localStorage.getItem('prefUnits');
        displayTempUnit = unit === 'imp' ? '°F' : '°C';
        displayPrecipUnit = unit === 'imp' ? ' in' : ' mm';
        
        impUnitButton.prop('checked', unit === 'imp');
        metUnitButton.prop('checked', unit === 'met');

        minSlide();
        maxSlide();
        updatePrecip();
        updateAvgTemp();
    }
    
    //function to toggle the tabs in the preference section
    function toggleTabs(activeTab, inactiveTab, activeButton, inactiveButton) {
        activeTab.toggleClass('tab active');
        inactiveTab.toggleClass('tab active');
        activeButton.css('background-color', 'lightgray');
        inactiveButton.css('background-color', 'rgb(160, 154, 154)');
    }

    //calling functions to update before inputs
    //fillColor();
    //updateUnits();
});
