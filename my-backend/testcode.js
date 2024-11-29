// Ignore for now this is just me testing db connection
const db = require('./index');

// Example query
db.query('SELECT * FROM userlogins', (error, results, username) => {
    if (error) throw error;
    
    console.log('Results from testcode.js: ', results);
});
