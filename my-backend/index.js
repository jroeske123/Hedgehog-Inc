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
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Error comparing passwords" });
                }

                if (isMatch) {
                    const rolePage = user.roleid === 1
                        ? "/new-frontend/loginPages/stuff/staff-dashboard.html"
                        : "/new-frontend/loginPages/client/clientdashbord.html";

                    // Fetch user's balance
                    db.query(
                        "SELECT balance FROM userlogins WHERE id = ?",
                        [user.id],
                        (balanceErr, balanceResults) => {
                            if (balanceErr) {
                                console.error(balanceErr);
                                return res.status(500).json({ error: "Failed to fetch balance" });
                            }

                            const balance = balanceResults[0]?.balance || 0;

                            return res.status(200).json({
                                message: "Login successful",
                                redirectTo: rolePage,
                                id: user.id,
                                balance,
                            });
                        }
                    );
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
// Endpoint to fetch user balance
// Endpoint to fetch user balance
app.get('/get-balance', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    db.query("SELECT balance FROM userlogins WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error fetching user balance:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        let balance = results[0].balance;
        
        // Convert balance to a number if it's not already a number
        balance = parseFloat(balance);
    
        // Check if balance is a valid number
        if (isNaN(balance)) {
            return res.status(500).json({ error: 'Invalid balance value' });
        }
    
        return res.status(200).json({ balance });
    });
    
});

app.get('/get-username', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    db.query("SELECT username FROM userlogins WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error fetching user username:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        let username = results[0].username;
    
        return res.status(200).json({ username });
    });
    
});
// Handle payment submission
app.post('/submit-payment', (req, res) => {
    const { id, amount } = req.body;

    if (!id || !amount) {
        return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const parsedAmount = parseFloat(amount);

    // Fetch user's current balance
    db.query("SELECT balance FROM userlogins WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error fetching user balance:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentBalance = results[0].balance;
        const newBalance = currentBalance - parsedAmount;

        if (newBalance < 0) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Update balance
        db.query("UPDATE userlogins SET balance = ? WHERE id = ?", [newBalance, id], (updateErr) => {
            if (updateErr) {
                console.error('Error updating balance:', updateErr);
                return res.status(500).json({ error: 'Failed to process payment' });
            }
            return res.status(200).json({ message: 'Payment processed successfully', balance: newBalance });
        });
    });
});

// Update user profile
app.post("/update-profile", (req, res) => {
    const { id, username, password } = req.body;

    if (!id || !username || !password) {
        return res.status(400).json({ error: "User ID, username, and password are required." });
    }

    // Hash the new password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Failed to hash password." });
        }

        // Update user information in the database
        db.query(
            "UPDATE userlogins SET username = ?, password = ? WHERE id = ?",
            [username, hashedPassword, id],
            (dbErr, results) => {
                if (dbErr) {
                    console.error("Database error:", dbErr);
                    return res.status(500).json({ error: "Failed to update profile." });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found." });
                }

                res.status(200).json({ message: "Profile updated successfully." });
            }
        );
    });
});

app.delete("/delete-user", (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    db.query("DELETE FROM userlogins WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete user." });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Account deleted successfully." });
    });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the db connection
module.exports = db;
