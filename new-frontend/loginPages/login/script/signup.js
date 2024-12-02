document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const usernameInput = document.getElementById("username-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const role = event.submitter.classList.contains("staff-login") ? "staff" : "client";

        if (!username || !email || !password) {
            errorMessage.textContent = "All fields are required.";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                // Redirect to appropriate dashboard
                const redirectUrl = role === "staff" 
                    ? "/new-frontend/loginPages/login/loginPage.html" 
                    : "/new-frontend/loginPages/login/loginPage.html";
                window.location.href = redirectUrl;
            } else {
                errorMessage.textContent = result.error || "Registration failed.";
            }
        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
        }
    });
});
