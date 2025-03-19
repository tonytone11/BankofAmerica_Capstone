const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');

// Signup route
router.post('/signup', async (req, res) => {
    let connection;
    try {
        // Extract user data from request body
        const { firstName, lastName, userName, email, password } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !userName || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        connection = await pool.getConnection();
        
        // Check if username already exists
        const [existingUsername] = await connection.query(
            'SELECT * FROM userInfo WHERE username = ?',
            [userName]
        );
        
        if (existingUsername.length > 0) {
            return res.status(409).json({ 
                success: false, 
                error: 'Username already exists' 
            });
        }
        
        // Check if email already exists
        const [existingEmail] = await connection.query(
            'SELECT * FROM userInfo WHERE email = ?',
            [email]
        );
        
        if (existingEmail.length > 0) {
            return res.status(409).json({ 
                success: false, 
                error: 'Email already registered' 
            });
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Store user in database - using the correct column names for your table
        const [result] = await connection.query(
            'INSERT INTO userInfo (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, userName, email, hashedPassword]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            userId: result.insertId
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Registration failed', 
            details: error.message 
        });
        
    } finally {
        if (connection) connection.release();
    }
});

// Login route
router.post('/login', async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password are required' 
            });
         }
        
        connection = await pool.getConnection();
        
        // Find user by email
        const [users] = await connection.query(
            'SELECT id, firstName, lastName, username, email, password, isAdmin FROM userInfo WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
        
        const user = users[0];
        
        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Login failed', 
            details: error.message 
        });
        
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;




