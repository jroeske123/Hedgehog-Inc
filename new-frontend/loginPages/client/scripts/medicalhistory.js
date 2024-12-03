const userId = localStorage.getItem("id"); // This should be dynamically set based on the logged-in user, such as from session or JWT token

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
            timeCell.textContent = appointment.time;
            row.appendChild(timeCell);

            const dateCell = document.createElement("td");
            dateCell.textContent = appointment.date;
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