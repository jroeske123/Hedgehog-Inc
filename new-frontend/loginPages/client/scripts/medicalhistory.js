// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'short', // Abbreviated weekday (e.g., "Mon")
        year: 'numeric',
        month: 'short',  // Abbreviated month (e.g., "Dec")
        day: 'numeric'
    });
}

const userId = localStorage.getItem("id"); // This should be dynamically set based on the logged-in user

// Fetch the appointments for this user
fetch(`http://localhost:3000/get-appointments-clients?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error fetching appointments: ' + data.error);
            return;
        }

        const tableBody = document.querySelector("#appointmentsTable tbody");
        tableBody.innerHTML = ""; // Clear any existing data

        // Populate the table with the fetched data
        data.forEach(appointment => {
            const row = document.createElement("tr");

            const timeCell = document.createElement("td");
            timeCell.textContent = appointment.time; // Assuming time is a separate field
            row.appendChild(timeCell);

            const dateCell = document.createElement("td");
            dateCell.textContent = formatDate(appointment.date); // Format the date
            row.appendChild(dateCell);

            const treatmentCell = document.createElement("td");
            treatmentCell.textContent = appointment.reasons; // Assuming "reasons" stores treatment details
            row.appendChild(treatmentCell);

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch appointments');
    });
