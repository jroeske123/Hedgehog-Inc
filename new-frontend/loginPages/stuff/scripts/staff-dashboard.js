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

document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");
    const hoursElement = document.getElementById("hours");
    const appointmentsElement = document.getElementById("appointments-list");
    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not logged in. Please log in to view your account details.");
        window.location.href = "/new-frontend/main/homeP.html";
        return;
    }

    const updateHours = async () => {
        try {
            const response = await fetch(`http://localhost:3000/get-total-hours?userId=${userId}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch hours: ${errorText}`);
            }
            const data = await response.json();
            hoursElement.textContent = data.totalHours.toFixed(2);
        } catch (error) {
            console.error("Error updating hours:", error);
        }
    };

    try {
        const usernameResponse = await fetch(`http://localhost:3000/get-username?id=${userId}`);
        if (!usernameResponse.ok) {
            const usernameError = await usernameResponse.text();
            throw new Error(`Username Error: ${usernameError}`);
        }

        const usernameData = await usernameResponse.json();
        usernameElement.textContent = usernameData.username;

        await updateHours();
        setInterval(updateHours, 300000);
    } catch (error) {
        console.error("Error initializing the dashboard:", error);
        alert("Failed to load user data. Please try again later.");
    }

    const updateAppointments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/get-appointments`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch appointments: ${errorText}`);
            }
            const data = await response.json();
            const upcomingAppointments = data.filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                return appointmentDate > new Date(); // Only upcoming appointments
            });
            
            appointmentsElement.innerHTML = upcomingAppointments.map(appointment => {
                // Format the date using formatDate function
                const formattedDate = formatDate(appointment.date);
                return `<p>- ${appointment.time} on ${formattedDate}: ${appointment.username}</p>`;
            }).join('');
        } catch (error) {
            console.error("Error updating appointments:", error);
        }
    };

    updateAppointments();
    setInterval(updateAppointments, 300000);
});
