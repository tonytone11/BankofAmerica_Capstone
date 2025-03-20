// config/db.config.js - Updated to use PostgreSQL
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Only use this for Render's self-signed certificates
    }
});

// Set the search_path to public schema
pool.query('SET search_path TO public')
    .then(() => {
        console.log('Search path set to public schema');
    })
    .catch(err => {
        console.error('Error setting search path:', err);
    });

pool.on('connect', (client) => {
    client.query('SET search_path TO public');
});

// Test connection on startup
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('PostgreSQL connection error:', err);
});

module.exports = pool;