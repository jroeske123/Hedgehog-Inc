document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/get-appointments')
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error('Error fetching appointments:', error));
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'short', // For abbreviated weekday (e.g., "Mon")
        year: 'numeric',
        month: 'short',  // Abbreviated month (e.g., "Dec")
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // AM/PM format
    });
}

function populateTable(appointments) {
    const tbody = document.querySelector('.appointment-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    appointments.forEach(appointment => {
        const formattedDate = formatDate(appointment.date); // Format date here
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.time}</td>
            <td>${formattedDate}</td> <!-- Use formatted date here -->
            <td>${appointment.username}</td>
            <td>${appointment.reasons}</td>
            <td><button class="delete-btn" data-id="${appointment.id}">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    // Add event delegation for delete buttons
    tbody.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.dataset.id;
            deleteAppointment(id, event.target);
        }
    });
}

function deleteAppointment(id, button) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    fetch(`http://localhost:3000/delete-appointments/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                button.closest('tr').remove(); // Remove row from the table
            } else {
                alert('Failed to delete appointment.');
            }
        })
        .catch(error => console.error('Error deleting appointment:', error));
}
