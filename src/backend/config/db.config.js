const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create and export database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
});

// Add a simple test function that can be called on server startup
pool.testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✓ Database connection test successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('✗ Database connection test failed:', error.message);
        return false;
    }
};

module.exports = pool;