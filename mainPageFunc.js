$(document).ready(function() {
    // Immediately add no-transition class to prevent initial transitions
    document.body.classList.add('no-transition');

    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // Remove no-transition class after a short timeout
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 0);

    // Function to toggle dark mode
    $('#darkModeToggle').on('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
        // Allow transition for dark mode toggle
        document.body.classList.remove('no-transition');
    });

    // Handle home button click without transition
    $('#homeBtn').on('click', function() {
        document.body.classList.add('no-transition'); // Prevent transition
        window.location.href = "PlaceFindr.html"; // Navigate immediately
    });

    // Prevent transition when navigating away
    $(window).on('beforeunload', function() {
        document.body.classList.add('no-transition');
    });

    // Functions for changing each input for the Preference Sliders
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

    // Navigate to account page
    document.getElementById("accountBtn").addEventListener("click", function() {
        window.location.href = "Account.html"; 
    });

    // Form handling for Login and Register
    $('#loginForm').on('submit', function(event){
        event.preventDefault(); // Prevent default form submission
    
        // Handle login logic (you can integrate this with backend or display validation)
        const email = $('#email').val();
        const password = $('#password').val();
        $('#loginMessage').text(`Logging in with ${email}...`);
    });
    

    $('#registerForm').on('submit', function(event){
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
            // Add registration logic here, such as sending data to the server
        }
    });
    
});
