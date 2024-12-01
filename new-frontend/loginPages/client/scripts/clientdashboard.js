document.addEventListener("DOMContentLoaded", async () => {
    const balanceElement = document.getElementById("balance");
    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not logged in. Please log in to view balance.");
        window.location.href = "/new-frontend/main/homeP.html";
        return;
    }

    try {
        const balanceResponse = await fetch(`http://localhost:3000/get-balance?id=${userId}`);
        const balanceData = await balanceResponse.json();

        if (balanceResponse.ok) {
            balanceElement.textContent = `$ ${balanceData.balance.toFixed(2)}`;
        } else {
            alert(balanceData.error || "Failed to fetch balance.");
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
        alert("An error occurred while fetching balance. Please try again.");
    }
});