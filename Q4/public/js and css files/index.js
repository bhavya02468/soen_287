    function updateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleString('en-US', { hour12: true }); // Adjust 'en-US' and options as needed
        document.getElementById('dateTime').innerText = dateTimeString;
    }

    setInterval(updateTime, 1000); // Update the time every second
    updateTime(); // Initialize the display

function logout(){
    sessionStorage.clear();
    alert("logged out")
}