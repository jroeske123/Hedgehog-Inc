function choosePlan(planType) {
    if (planType === 'monthly') {
        alert("You have chosen the Monthly Payment Plan.");
        // Add additional logic for selecting the monthly plan here
    } else if (planType === 'weekly') {
        alert("You have chosen the Weekly Payment Plan.");
        // Add additional logic for selecting the weekly plan here
    } else {
        console.error("Unknown plan type:", planType);
    }
}
