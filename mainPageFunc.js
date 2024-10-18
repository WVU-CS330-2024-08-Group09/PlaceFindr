$(document).ready(function(){

    //Function for toggling Dark/Light Mode
    const darkToggle = document.getElementById('darkModeToggle');
      darkToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
      });

      //Functions for changing each input for the Preference Sliders
      const $tempInput = $('#tempPref');
      const $tempValue = $('#tempValue');

      const $precipInput = $('#precipPref');
      const $precipValue = $('#precipValue');

      const $humidInput = $('#humidPref');
      const $humidValue = $('#humidValue');

      $tempInput.on('input', function(){
            $tempValue.text($(this).val());
      });

      $precipInput.on('input', function(){
        $precipValue.text($(this).val());
      });

      $humidInput.on('input', function(){
        $humidValue.text($(this).val());
      });
});