const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection string
const connectionString = `mysql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME}`;

console.log('Connecting to database with string (password hidden):',
    connectionString.replace(encodeURIComponent(process.env.DB_PASSWORD), '******'));

// Create pool with detailed error handling
const pool = mysql.createPool({
    uri: connectionString,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 60000,
    ssl: {
        rejectUnauthorized: false // Try with this set to false first
    }
});

module.exports = pool;