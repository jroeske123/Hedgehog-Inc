/*
// DB SIDE
const db = require('./index');
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const saltRounds = 4;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("http://localhost:3000/submit", (req, res) => {
    const { username, email, password } = req.body;
    
    if(email){
        //Register
        bcrypt.hash(password_input, saltRounds, (err, hash) =>{
            if(err) throw err;
            db.query('INSERT INTO userlogins (username, email, password, roleid) VALUES (?, ?, ?, ?)', [username, email, hash, 0], (error, results) => {
                if (error) throw error;
                res.status(200).send('User registered successfully');
            });
        });
    }
    else{
        db.query('SELECT * FROM userlogins WHERE userame = ?', [username], (error, results) => {
            if(error) throw error;

            if(results.length > 0){
                const hashedPassword = results[0].password;
                bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        res.status(200).send('Login successful!');
                    }
                    else{
                        res.status(401).send('Incorrect password!');
                    }
                });
            }
            else{
                res.status(401).send('Username not found!');
            }
        })
    }
})
*/
