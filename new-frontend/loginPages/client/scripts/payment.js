document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById("paymentForm");
    const balanceElement = document.querySelector(".current div:nth-child(2) p");

    // Extract the current balance
    let currentBalance = parseFloat(balanceElement.textContent.replace("$", "").trim());

    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        // Get form values
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
            // Send payment data to the server
            const response = await fetch("http://localhost:3000/submit-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cardName, cardNumber, expDate, cvv, amount }),
            });
    
            const result = await response.json();
            if (response.ok) {
                // Update the balance in the DOM
                balanceElement.textContent = `$ ${result.balance.toFixed(2)}`;
                alert(result.message);
            } else {
                alert(result.error || "Payment failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        }
    });    
});
