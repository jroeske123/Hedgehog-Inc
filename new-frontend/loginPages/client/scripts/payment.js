document.addEventListener("DOMContentLoaded", async () => {
    const paymentForm = document.getElementById("paymentForm");
    const balanceElement = document.querySelector(".current div:nth-child(2) p");

    const id = localStorage.getItem("id"); // Retrieve user ID from local storage

    if (!id) {
        alert("User not logged in. Please log in to view balance.");
        window.location.href = "/new-frontend/main/homeP.html";
        return;
    }

    // Fetch current balance from the server
    try {
        const balanceResponse = await fetch(`http://localhost:3000/get-balance?id=${id}`);
        const balanceData = await balanceResponse.json();

        if (balanceResponse.ok) {
            // Update the balance display
            balanceElement.textContent = `$ ${balanceData.balance.toFixed(2)}`;
        } else {
            alert(balanceData.error || "Failed to fetch balance.");
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
        alert("An error occurred while fetching balance. Please try again.");
    }

    // Handle payment submission
    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        const cardName = document.getElementById("card-name").value;
        const cardNumber = document.getElementById("card-number").value;
        const expDate = document.getElementById("exp-date").value;
        const cvv = document.getElementById("cvv").value;
        const amount = document.getElementById("amount").value;

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/submit-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, amount }),
            });

            const result = await response.json();

            if (response.ok) {
                // Update balance in the UI after successful payment
                balanceElement.textContent = `$ ${result.balance.toFixed(2)}`;
                alert(result.message);
            } else {
                alert(result.error || "Payment failed.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
