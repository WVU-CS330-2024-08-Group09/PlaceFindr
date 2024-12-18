/**
 * mainPageFunc.js
 * 
 * This file handles functionality for the home/index page.
 */


import { querryPoints, savePreference, setPreference} from './map.js';

document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    document.body.classList.add('no-transition');

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 10);

    const toggleButton = document.getElementById('toggleDarkMode');
    toggleButton.addEventListener('click', () => {
        document.body.classList.add('no-transition'); 

        const isDarkMode = document.body.classList.toggle('dark-mode'); 
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 10);
    });
});

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
    const minGap = 7.5
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
    seasonSelect.on('change',querryPoints);
    $minTempPref.on('input', minSlide);
    $maxTempPref.on('input', maxSlide);
    $avgTempPref.on('input',updateAvgTemp);
    $precipPref.on('input',updatePrecip);
    saveSettButton.on('click',updateSettings);
    prefTabButton.on('click', function(){toggleTabs(prefTab,settingsTab,prefTabButton,settTabButton)});
    settTabButton.on('click', function(){toggleTabs(settingsTab,prefTab,settTabButton,prefTabButton)});
    searchButton.on('click', querryPoints);
    saveButton.on('click', savePreference);
    loadButton.on('click', setPreference);
    
    
    ///*** All function declarations ***///

    /**
     * Toggles dark mode on or off and saves its state to localStorage.
     */
    function toggleDarkMode() {
        document.body.classList.add('no-transition'); 
        
        const isDarkMode = document.body.classList.toggle('dark-mode'); // Toggle dark mode
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 10); 
    }
    
    //functions for updating the double sliders
    /**
     * Updates minimum slider of the double slider and the displayed value.
     */
    function minSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $minTempPref.val(parseInt($maxTempPref.val()) - minGap);
        }
        // Convert for display only, keeping internal value in Celsius
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($minTempPref.val() * 9/5) + 32).toFixed(1) 
            : $minTempPref.val();
        $minTempValue.text(Math.round(displayValue) + displayTempUnit);
        fillColor();
        updateAvgTemp();
    }
    /**
     * Updates maximum slider of the double slider and the displayed value.
     */
    function maxSlide(){
        if(parseInt($maxTempPref.val())- parseInt($minTempPref.val()) <= minGap){
            $maxTempPref.val(parseInt($minTempPref.val()) + minGap);
        }
        // Convert for display only, keeping internal value in Celsius
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($maxTempPref.val() * 9/5) + 32).toFixed(1) 
            : $maxTempPref.val();
        $maxTempValue.text(Math.round(displayValue) + displayTempUnit);
        fillColor();
        updateAvgTemp();
    }

    /**
     * Updates the fill between the selections of the double slider.
     */
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

    /**
     * Updates the average temperature slider and the displayed value.
     */
    function updateAvgTemp(){
        // Convert for display only, keeping internal value in Celsius
        if(parseInt($avgTempPref.val()) > parseInt($maxTempPref.val())){
            $avgTempPref.val(parseInt($maxTempPref.val()));
        } else if(parseInt($avgTempPref.val()) < parseInt($minTempPref.val())){
            $avgTempPref.val(parseInt($minTempPref.val()));
        }
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? (($avgTempPref.val() * 9/5) + 32).toFixed(1) 
            : $avgTempPref.val();
        $avgTempValue.text(Math.round(displayValue) + displayTempUnit);
    }

    /**
     * Updates the average precipitation and the displayed value.
     */
    function updatePrecip(){
        // Convert for display only, keeping internal value in mm
        let displayValue = localStorage.getItem('prefUnits') === 'imp' 
            ? ($precipPref.val() / 25.4).toFixed(2) 
            : $precipPref.val();
        $precipValue.text(Math.round(displayValue * 10) / 10 + displayPrecipUnit);
    }

    /**
     * Updates the units shown next to the display values based on selected measurement system (imperial or metric).
     */
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

    /**
     * Updates the unit setting (imperial or metric).
     */
    function updateSettings(){
        if(impUnitButton.is(':checked')){
            localStorage.setItem('prefUnits','imp')
        }
        else if(metUnitButton.is(':checked')){
            localStorage.setItem('prefUnits','met')
        }
        updateUnits();
    }
    
    /**
     * Toggles the tabs in the preference section.
     * @param {jQuery} activeTab - The tab being activated, either prefTab or settingsTab.
     * @param {jQuery} inactiveTab - The tab being deactivated, either prefTab or settingsTab.
     * @param {jQuery} activeButton - The button being shown as selected, either prefTabButton or settTabButton.
     * @param {jQuery} inactiveButton - The button being shown as not actively selected, either prefTabButton or settTabButton.
     */
    function toggleTabs(activeTab, inactiveTab, activeButton, inactiveButton) {
        activeTab.toggleClass('tab active');
        inactiveTab.toggleClass('tab active');
        activeButton.css('background-color', 'lightgray');
        inactiveButton.css('background-color', 'rgb(160, 154, 154)');
    }

    //calling functions to update before inputs
    fillColor();
    updateUnits();
});
