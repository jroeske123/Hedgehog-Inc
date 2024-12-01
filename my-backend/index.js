const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const sendEmail = require('./mailer'); 
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const saltRounds = 12;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve static files
app.use(express.static(path.join(__dirname, '../new-frontend')));

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../new-frontend/main', 'homeP.html'));
});

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Test API
app.get('/api/data', (req, res) => {
    res.send('API is working!');
});
app.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields, including role, are required" });
  }

  const roleId = role === "staff" ? 1 : 0; // 1 for staff, 0 for clients

  // Check if user already exists
  db.query(
      "SELECT * FROM userlogins WHERE email = ?",
      [email],
      (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: "Database error" });
          }

          if (results.length > 0) {
              return res.status(400).json({ error: "Email already exists" });
          }

          // Hash password and insert into database
          bcrypt.hash(password, saltRounds, (err, hash) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Error hashing password" });
              }

              db.query(
                  "INSERT INTO userlogins (username, email, password, roleid) VALUES (?, ?, ?, ?)",
                  [username, email, hash, roleId],
                  (error, results) => {
                      if (error) {
                          console.error(error);
                          return res.status(500).json({ error: "Database insertion error" });
                      }
                      res.status(201).json({ message: `User registered successfully as ${role}` });
                  }
              );
          });
      }
  );
});

// **Login endpoint**
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
  }

  // Query to find the user by username
  db.query(
      "SELECT * FROM userlogins WHERE username = ?",
      [username],
      (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: "Database error" });
          }

          if (results.length === 0) {
              return res.status(404).json({ error: "User not found" });
          }

          const user = results[0];

          // Compare the provided password with the hashed password
          bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Error comparing passwords" });
              }

              if (isMatch) {
                  // Check the user's role and respond with the appropriate dashboard link
                  const rolePage = user.roleid === 1
                      ? "/new-frontend/loginPages/stuff/staff-dashboard.html"
                      : "/new-frontend/loginPages/client/clientdashbord.html";

                  return res.status(200).json({ 
                      message: "Login successful", 
                      redirectTo: rolePage 
                  });
              } else {
                  return res.status(401).json({ error: "Incorrect password" });
              }
          });
      }
  );
});
// Handle email sending
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
  
    if (!name || !subject || !message || !email) {
      return res.status(400).send({ message: 'name, subject, message, and email are required' });
    }
  
    try {
      await sendEmail(name, email, message, subject);
      res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ message: 'Failed to send email', error: error.message });
    }
});

// Handle payment submission
app.post('/submit-payment', (req, res) => {
  const { cardName, cardNumber, expDate, cvv, amount } = req.body;

  // Validate input
  if (!cardName || !cardNumber || !expDate || !cvv || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const parsedAmount = parseFloat(amount);

  // Query to check if the user exists
  const checkUserQuery = "SELECT * FROM clients WHERE card_number = ?";
  db.query(checkUserQuery, [cardNumber], (err, results) => {
      if (err) {
          console.error('Error checking user:', err);
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
          // User exists, update their balance
          const user = results[0];
          const newBalance = user.balance - parsedAmount;

          if (newBalance < 0) {
              return res.status(400).json({ error: 'Insufficient balance' });
          }

          const updateBalanceQuery = "UPDATE clients SET balance = ? WHERE card_number = ?";
          db.query(updateBalanceQuery, [newBalance, cardNumber], (err) => {
              if (err) {
                  console.error('Error updating balance:', err);
                  return res.status(500).json({ error: 'Failed to process payment' });
              }
              return res.status(200).json({ message: 'Payment processed successfully', balance: newBalance });
          });
      } else {
          // User doesn't exist, insert a new user
          const initialBalance = 5000; // Default initial balance
          const newBalance = initialBalance - parsedAmount;

          if (newBalance < 0) {
              return res.status(400).json({ error: 'Insufficient balance for new user' });
          }

          const insertUserQuery = "INSERT INTO clients (name, card_number, balance) VALUES (?, ?, ?)";
          db.query(insertUserQuery, [cardName, cardNumber, newBalance], (err) => {
              if (err) {
                  console.error('Error adding new user:', err);
                  return res.status(500).json({ error: 'Failed to add new user' });
              }
              return res.status(201).json({ message: 'New user added and payment processed', balance: newBalance });
          });
      }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the db connection
module.exports = db;
