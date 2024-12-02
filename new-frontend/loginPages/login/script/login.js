document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation of inputs
        if (!username || !password) {
            errorMessage.textContent = "Username and password are required.";
            return;
        }

        if(password.length > 16){
            errorMessage.textContent = "Password is too long.";
            return;
        }

        if(password.length < 6){
            errorMessage.textContent = "Password is too short.";
            return;
        }

        // Passing to login process
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            // Logging in with corresponding data if valid
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
