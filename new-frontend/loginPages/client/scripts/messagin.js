document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const formData = new FormData(event.target); // Collect form data
    
    // Convert form data to a plain object
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
  
   try {
      // Send the form data as a POST request to your backend
      const response = await fetch('http://127.0.0.1:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(formObject), // Convert the form data to JSON
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        // Success - handle success message
        alert('Email sent successfully');
      } else {
        // Error - handle error message
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      // Catch any network errors
      console.error('Error:', error);
      alert('An error occurred while sending the message');
    }
  });
  