document.addEventListener("DOMContentLoaded", async () => {
    const usernameElement = document.getElementById("username");
    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not logged in. Please log in to view your account details.");
        window.location.href = "/new-frontend/main/homeP.html";
        return;
    }

    try {
        // Fetch balance and username in parallel
        const [usernameResponse] = await Promise.all([
            fetch(`http://localhost:3000/get-username?id=${userId}`)
        ]);

        if ( !usernameResponse.ok) {
            const usernameError = await usernameResponse.text();
            throw new Error(`Username Error: ${usernameError}`);
        }

        const usernameData = await usernameResponse.json();

        usernameElement.textContent = usernameData.username;

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again later.");
    }
});
