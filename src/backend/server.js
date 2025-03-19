const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3003; // Changed to 3003 to match your frontend expectations

// Import database pool from config
const pool = require('./config/db.config');

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../pages/Home')));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        console.error("Missing Authorization Header");
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    console.log("Extracted Token:", token);

    if (!token) {
        console.error("Missing Token in Header");
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT Verification Failed:", err);
            return res.status(403).json({ error: "Unauthorized - Invalid token" });
        }

        console.log("Token Verified. Extracted id:", user.id);
        req.user = user; // Attach user data to request
        next();
    });
};

// Register auth and user routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Route to log training hours
// Route to log training hours
app.post('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
    try {
        const { date, hours } = req.body;
        
        if (!date || hours === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Date and hours are required' 
            });
        }
        
        const userId = req.user.id;
        console.log('Logging hours for user:', userId, 'Date:', date, 'Hours:', hours);

        connection = await pool.getConnection();

        // Check if an entry already exists for that date
        const [existingEntry] = await connection.query(
            'SELECT * FROM hoursLogged WHERE user_id = ? AND date = ?',
            [userId, date]
        );

        let result;
        if (existingEntry.length > 0) {
            // Update existing entry
            console.log('Updating existing entry');
            [result] = await connection.query(
                'UPDATE hoursLogged SET hours = ? WHERE user_id = ? AND date = ?',
                [hours, userId, date]
            );
            
            console.log('Update result:', result);
        } else {
            // Insert new entry
            console.log('Creating new entry');
            [result] = await connection.query(
                'INSERT INTO hoursLogged (user_id, date, hours) VALUES (?, ?, ?)',
                [userId, date, hours]
            );
            
            console.log('Insert result:', result);
        }

        res.status(200).json({ 
            success: true,
            message: 'Hours logged successfully' 
        });

    } catch (error) {
        console.error('Error logging hours:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            message: error.message
        });

    } finally {
        if (connection) {
            console.log('Releasing database connection');
            connection.release();
        }
    }
});

// Route to fetch user-specific training hours
app.get('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;
        console.log('Fetching hours for user:', userId);

        connection = await pool.getConnection();
        const [hoursData] = await connection.query(
            'SELECT date, hours FROM hoursLogged WHERE user_id = ?',
            [userId]
        );

        console.log('Retrieved hours data:', hoursData);

        // Format the data as expected by the frontend
        const formattedData = {};
        hoursData.forEach(row => {
            // Format date as YYYY-MM-DD string for use as object key
            const dateKey = row.date.toISOString().split('T')[0];
            formattedData[dateKey] = parseFloat(row.hours);
        });

        console.log('Formatted data for frontend:', formattedData);
        res.status(200).json(formattedData);

    } catch (error) {
        console.error('Error fetching hours:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            message: error.message 
        });

    } finally {
        if (connection) {
            console.log('Releasing database connection');
            connection.release();
        }
    }
});

        

// Route to fetch user-specific training hours
app.get('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;

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

// POST route for contact form submissions
app.post('/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body);
    
    try {
        // Extract form data from request body
        const { adultName, childname, email, subject, message } = req.body;
        
        console.log('Extracted fields:', { adultName, childname, email, subject, message });
        
        // Validate required fields
        if (!adultName || !email || !message) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }
        
        // Get a connection from the pool
        let connection;
        try {
            connection = await pool.getConnection();
            console.log('Database connection established');
            
            // Insert form data into contactForms table
            const query = `
                INSERT INTO contactForms 
                (adultName, childname, email, subject, message) 
                VALUES 
                (?, ?, ?, ?, ?)
            `;
            
            console.log('Executing query:', query);
            console.log('With values:', [adultName, childname, email, subject, message]);
            
            const [result] = await connection.query(query, [adultName, childname, email, subject, message]);
            
            console.log('Query result:', result);
            
            // Check if insertion was successful
            if (result.affectedRows === 1) {
                // Successful submission
                console.log('Message inserted successfully with ID:', result.insertId);
                res.status(201).json({ 
                    success: true, 
                    message: 'Your message has been submitted successfully', 
                    id: result.insertId 
                });
            } else {
                console.log('Insert operation did not affect any rows');
                throw new Error('Failed to insert data');
            }
        } catch (dbError) {
            console.error('Database operation error:', dbError);
            throw dbError;
        } finally {
            if (connection) {
                console.log('Releasing database connection');
                connection.release();
            }
        }
    } catch (error) {
        console.error('Error details:', error);
        // Log the full error details for debugging
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while submitting your message. Please try again.',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// get req displaying contact messages 
app.get('/admin/users/messages', async (req, res) => {
    try {
        // SQL query to fetch all contact form submissions with full message
        const query = `
            SELECT id, adultName, childname, email, subject, message 
            FROM contactForms 
            ORDER BY id DESC
        `;
        
        const [messages] = await pool.query(query);
        
        // For an API response
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
});

// displaying user info on admin page
app.get('/admin/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, username, email FROM userInfo ORDER BY id');
        res.json(rows); // Send as JSON to frontend
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});

// Add a test endpoint 
app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Catch-all route should be LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/Home'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add this to your server.js or app.js
app.get('/api/test-db', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('SELECT 1 as test');
      connection.release();
      res.json({ 
        success: true, 
        message: 'Database connection successful',
        result 
      });
    } catch (error) {
      console.error('Database test error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        code: error.code
      });
    }
  });