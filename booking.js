window.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingForm');
    const responseDiv = document.getElementById('respone');

    if (!form || !responseDiv) {
        console.error('Form or response div not found');
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const formData = new FormData(form);

        // Get the selected date and time
        const dateInput = document.getElementById("date");
        const timeInput = document.getElementById("time");

        if (!dateInput || !timeInput) {
            console.error('Date or time input not found');
            return;
        }

        const date = new Date(dateInput.value);
        const time = new Date("1970-01-01T" + timeInput.value + "Z");
        const selectedDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());

        // Get the current date and time
        const currentDateTime = new Date();

        console.log("Current Date and Time:", currentDateTime);
        console.log("Selected Date and Time:", selectedDateTime);

        // Validate the selected date and time
        if (selectedDateTime < currentDateTime) {
            alert("Pick-up date and time must be later than the current date and time.");
            return;
        }

        // Send fetch request
        fetch('booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData).toString()
        })
            .then(response => response.text())
            .then(data => {
                responseDiv.innerHTML = data; // Insert the HTML response into the responseDiv
                form.reset(); // Reset the form
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});