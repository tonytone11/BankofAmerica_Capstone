
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(" Authorization Header:", authHeader); // Debugging

    if (!authHeader) {
        console.error(" Missing Authorization Header");
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    console.log(" Extracted Token:", token); // Debugging

    if (!token) {
        console.error(" Missing Token in Header");
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(" JWT Verification Failed:", err);
            return res.status(403).json({ error: "Unauthorized - Invalid token" });
        }

        console.log(" Token Verified. Extracted id:", user.id);  //  Use "id" instead of "user_id"
        req.user = user; // Attach user data to request
        next();
    });
};


// Route to log training hours
app.post('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
    try {
        const { date, hours } = req.body;
        const userId = req.user.id;  //  Use "id" instead of "user_id"

        connection = await pool.getConnection();

        // Check if an entry already exists for that date
        const [existingEntry] = await connection.query(
            'SELECT * FROM hoursLogged WHERE user_id = ? AND date = ?',
            [userId, date]
        );

        if (existingEntry.length > 0) {
            // Update existing entry
            await connection.query(
                'UPDATE hoursLogged SET hours = ? WHERE user_id = ? AND date = ?',
                [hours, userId, date]
            );
        } else {
            // Insert new entry
            await connection.query(
                'INSERT INTO hoursLogged (user_id, date, hours) VALUES (?, ?, ?)',
                [userId, date, hours]
            );
        }

        res.status(200).json({ message: 'Hours logged successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });

    } finally {
        if (connection) connection.release();
    }
});

// Route to fetch user-specific training hours
app.get('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;  //  Use "id" instead of "user_id"

        connection = await pool.getConnection();
        const [hoursData] = await connection.query(
            'SELECT date, hours FROM hoursLogged WHERE user_id = ?',
            [userId]
        );

        const formattedData = {};
        hoursData.forEach(row => {
            formattedData[row.date] = row.hours;
        });

        res.status(200).json(formattedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });

    } finally {
        if (connection) connection.release();
    }
});


app.listen(3002, () => console.log('Server running on port 3002'));
