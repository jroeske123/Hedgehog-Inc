function choosePlan(planType) {
    const userId = localStorage.getItem("id");
    const url = "http://localhost:3000/save-plan";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            planType,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert(`You have successfully chosen the ${planType} plan.`);
            } else {
                alert(`Failed to choose the ${planType} plan. ${data.error || ""}`);
            }
        })
        .catch((error) => {
            console.error("Error saving plan:", error);
            alert("An error occurred while choosing the plan.");
        });
}
