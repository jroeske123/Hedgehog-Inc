document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.getElementById("update-profile-form");
    const deleteButton = document.getElementById("delete-btn");

    deleteButton.addEventListener("click", async () => {
        const userId = localStorage.getItem("id"); // Assuming the user's ID is stored in localStorage.

        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }

        const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmation) return;

        try {
            const response = await fetch("http://localhost:3000/delete-user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                localStorage.clear(); // Clear user data.
                window.location.href = "/new-frontend/main/homeP.html"; // Redirect to home page.
            } else {
                alert(result.error || "Failed to delete account.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
    
    updateForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const userId = localStorage.getItem("id"); // Assuming user ID is stored in localStorage.

        if (!username || !password) {
            alert("Username and password are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId, username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                location.reload(); // Reload the page to reflect changes.
            } else {
                alert(result.error || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
