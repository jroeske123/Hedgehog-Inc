// Ignore for now this is just me testing db connection
const db = require('./index');
const bcrypt = require('bcrypt');
const saltRounds = 4;

const username_input = 'user123';
const email_input = 'user123@example.com';
const password_input = 'password123';

// Example query
bcrypt.hash(password_input, saltRounds, (err, hash) =>{
    if(err) throw err;
    db.query('INSERT INTO userlogins (username, email, password, roleid) VALUES (?, ?, ?, ?)', [username_input, email_input, hash, 0], (error, results) => {
        if (error) throw error;
        
        console.log('Data inserted successfully');
    });
});