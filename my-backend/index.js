const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const sendEmail = require('./mailer'); 

const app = express();
app.use(cors());
app.use(express.json());


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

    // Assume a fixed client ID for simplicity (in a real app, this should be dynamic)
    const clientId = 1; 

    // Query to update the balance in the database
    const query = "UPDATE clients SET balance = balance - ? WHERE id = ?";
    
    db.query(query, [parseFloat(amount), clientId], (err, result) => {
        if (err) {
            console.error('Error updating balance:', err);
            return res.status(500).json({ error: 'Failed to process payment' });
        }
        res.status(200).json({ message: 'Payment processed successfully' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the db connection
module.exports = db;
