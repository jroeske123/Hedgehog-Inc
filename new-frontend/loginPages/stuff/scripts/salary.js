// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the submit button and input fields
    const submitButton = document.getElementById("submitButton");
    const hoursInput = document.getElementById("hours");
    const salaryInput = document.getElementById("salary");

    // Assume userId is available globally after login
    const userId = localStorage.getItem("id");

    // Function to fetch and update total hours
    function updateTotalHours() {
        fetch(`http://localhost:3000/get-total-hours?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch total hours.");
                }
                return response.json();
            })
            .then(data => {
                const totalHoursElement = document.querySelector("#totalHours");
                if (totalHoursElement) {
                    totalHoursElement.textContent = `Total Hours: ${data.totalHours}`;
                }
            })
            .catch(error => {
                console.error("Error fetching total hours:", error);
            });
    }

    // Function to fetch and update the expected check
    function updateExpectedCheck() {
        fetch(`http://localhost:3000/calculate-expected-check?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch expected check.");
                }
                return response.json();
            })
            .then(data => {
                const expectedCheckElement = document.querySelector("#expectedCheck");
                if (expectedCheckElement) {
                    expectedCheckElement.textContent = `Expected Check: $${data.expectedCheck.toFixed(2)}`;
                }
            })
            .catch(error => {
                console.error("Error fetching expected check:", error);
            });
    }

    // Submit button event listener
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        const hours = hoursInput.value;
        const salary = salaryInput.value;

        if (userId && hours && salary) {
            const payload = {
                userId,
                hours: parseFloat(hours),
                salary: parseFloat(salary),
            };

            fetch("http://localhost:3000/save-hours-salary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || "Failed to save data");
                        });
                    }
                    return response.json();
                })
                .then(() => {
                    updateTotalHours(); // Update total hours after successful save
                    updateExpectedCheck(); // Update expected check after successful save
                    alert("Data saved successfully!");
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Failed to save data. Please try again.");
                });
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Initial fetches on page load
    updateTotalHours();
    updateExpectedCheck();
});
