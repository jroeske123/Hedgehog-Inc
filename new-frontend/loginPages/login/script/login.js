document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorMessage.textContent = "Username and password are required.";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("id", result.id);
                localStorage.setItem("balance", result.balance);
                alert(result.message);
                window.location.href = result.redirectTo;
            } else {
                errorMessage.textContent = result.error || "Login failed.";
            }
        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
        }
    });
});
