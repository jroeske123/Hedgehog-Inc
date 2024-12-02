document.addEventListener("DOMContentLoaded", async () => {
    const balanceElement = document.getElementById("balance");
    const usernameElement = document.getElementById("username");
    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not logged in. Please log in to view your account details.");
        window.location.href = "/new-frontend/main/homeP.html";
        return;
    }

    try {
        // Fetch balance and username in parallel
        const [balanceResponse, usernameResponse] = await Promise.all([
            fetch(`http://localhost:3000/get-balance?id=${userId}`),
            fetch(`http://localhost:3000/get-username?id=${userId}`)
        ]);

        if (!balanceResponse.ok || !usernameResponse.ok) {
            const balanceError = await balanceResponse.text();
            const usernameError = await usernameResponse.text();
            throw new Error(`Balance Error: ${balanceError} | Username Error: ${usernameError}`);
        }

        const balanceData = await balanceResponse.json();
        const usernameData = await usernameResponse.json();

        balanceElement.textContent = `$ ${balanceData.balance.toFixed(2)}`;
        usernameElement.textContent = usernameData.username;

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data. Please try again later.");
    }
});
