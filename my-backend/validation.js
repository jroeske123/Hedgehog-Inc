/*
console.log("Connected");

const form = document.getElementById('form')
const username_input = document.getElementById('username-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const error_message = document.getElementById('error-message')

console.log('Form: ', form);
console.log('Username: ', username_input);
console.log('Email: ', email_input);
console.log('Password: ', password_input);

form.addEventListener('submit', async (e) => {
    
    let errors = []
    
    if(email_input){
        console.log("Using signup errors");
        errors = getSignupErrors(username_input.value, email_input.value, password_input.value)
    }
    else{
        console.log("Using login errors");
        errors = getLoginErrors(username_input.value, password_input.value)
    }

    if(errors.length > 0){
        e.preventDefault()
        error_message.innerText = errors.join(". ")
    }
    else{
        // Handle no errors in form submission (login / register)
        const data = {
            username: username_input.value,
            email: email_input ? email_input.value : null,
            password: password_input.value
        };

        try{
            const response = await fetch("http://localhost:3000/submit", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if(response.ok){
                console.log('Request successful');
                // Handle success
            }
            else{
                console.log('Request failed');
                // Handle Failure
            }
        } catch(error){
            console.log('Error', error);
        }
    }
})

function getSignupErrors(username, email, password){
    let errors = []
    
    if(username == '' || username == null){
        errors.push('Username is required')
        username_input.parentElement.classList.add('incorrect')
    }

    if(email == '' || email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }

    if(password == '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

function getLoginErrors(username, password){
    let errors = []

    if(username == '' || username == null){
        errors.push('Username is required')
        username_input.parentElement.classList.add('incorrect')
    }

    if(password == '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}
*/