const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../new-frontend')));

const db = mysql.createConnection({
    host: "csc131final-csc131final.k.aivencloud.com",
    user: "thien",
    password: "AVNS_PznZWrj87vsIQOZrt6b",
    database: "csc131",
    port: "26347"
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/api/data', (req, res) => {
    res.send('API is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the db connection
module.exports = db;
