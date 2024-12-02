document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");
    const hoursElement = document.getElementById("hours");
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
            hoursElement.textContent = data.totalHours.toFixed(2); // Assuming you want two decimal places
        } catch (error) {
            console.error("Error updating hours:", error);
        }
    };

    try {
        // Fetch username and display it
        const usernameResponse = await fetch(`http://localhost:3000/get-username?id=${userId}`);
        if (!usernameResponse.ok) {
            const usernameError = await usernameResponse.text();
            throw new Error(`Username Error: ${usernameError}`);
        }

        const usernameData = await usernameResponse.json();
        usernameElement.textContent = usernameData.username;

        // Initial fetch of hours
        await updateHours();

        // Update hours every 5 minutes (300,000 milliseconds)
        setInterval(updateHours, 300000);
    } catch (error) {
        console.error("Error initializing the dashboard:", error);
        alert("Failed to load user data. Please try again later.");
    }
});
