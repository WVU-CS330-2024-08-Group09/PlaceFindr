$(document).ready(function(){

    // Function for toggling Dark/Light Mode
    const darkToggle = document.getElementById('darkModeToggle');
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
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
