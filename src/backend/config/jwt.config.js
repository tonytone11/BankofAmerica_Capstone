//jwt.config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    secret: process.env.JWT_SECRET || 'your-secret-key', // Use environment variable or fallback
    expiresIn: '24h' // Token expiration time
};