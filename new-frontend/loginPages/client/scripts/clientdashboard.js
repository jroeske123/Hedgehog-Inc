document.addEventListener("DOMContentLoaded", async () => {
    const balanceElement = document.getElementById("balance");
    const usernameElement = document.getElementById("username");
    const appointmentsElement = document.getElementById("appointments");
    const careTeamElement = document.getElementById("careTeam");
    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not logged in. Please log in to view your account details.");
        window.location.href = "/new-frontend/main/homeP.html";
        return;
    }

    try {
        // Fetch user details (balance, username, appointments, plan)
        const [balanceResponse, usernameResponse, appointmentsResponse, planResponse] = await Promise.all([
            fetch(`http://localhost:3000/get-balance?id=${userId}`),
            fetch(`http://localhost:3000/get-username?id=${userId}`),
            fetch(`http://localhost:3000/get-appointments-clients?userId=${userId}`),
            fetch(`http://localhost:3000/get-plan?id=${userId}`) // Fetch user's current plan
        ]);

        if (!balanceResponse.ok || !usernameResponse.ok || !appointmentsResponse.ok || !planResponse.ok) {
            throw new Error("Error fetching user data");
        }

        const balanceData = await balanceResponse.json();
        const usernameData = await usernameResponse.json();
        const appointmentsData = await appointmentsResponse.json();
        const planData = await planResponse.json();

        // Update the UI with fetched data
        balanceElement.textContent = `$ ${balanceData.balance.toFixed(2)}`;
        usernameElement.textContent = usernameData.username;
        careTeamElement.textContent = planData.plan || "No plan selected"; // Update dental plan

        // Dynamically update the appointments list
        appointmentsElement.innerHTML = ''; // Clear existing appointments
        appointmentsData.forEach(appointment => {
            const formattedDate = formatDate(appointment.date); // Format the appointment date
            const appointmentItem = document.createElement('p');
            appointmentItem.textContent = `- ${appointment.time} on ${formattedDate}: ${appointment.reasons}`;
            appointmentsElement.appendChild(appointmentItem);
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again later.");
    }
});

// Function to format date (already provided in your code)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'short', // For abbreviated weekday (e.g., "Mon")
        year: 'numeric',
        month: 'short',  // Abbreviated month (e.g., "Dec")
        day: 'numeric',
        hour12: true, // AM/PM format
    });
}
