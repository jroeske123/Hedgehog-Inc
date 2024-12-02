// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get the submit button and input fields
    const submitButton = document.getElementById("submitButton");
    const hoursInput = document.getElementById("hours");
    const salaryInput = document.getElementById("salary");

    // Add an event listener to the submit button
    submitButton.addEventListener("click", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the values of the inputs
        const hours = hoursInput.value;
        const salary = salaryInput.value;

        // Simple validation to ensure that both fields are filled
        if (hours && salary) {
            // You can now submit the values to a backend, or just display them
            alert(`Hours worked: ${hours}\nSalary: ${salary}`);

            // You can also send this data to the server using AJAX, for example:
            /*
            fetch('/submit-salary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hours: hours, salary: salary })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            */

        } else {
            alert("Please fill in both fields.");
        }
    });
});
