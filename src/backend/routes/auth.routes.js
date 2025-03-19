// routes/auth.routes.js - Refactored to use consistent jwt config
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Changed to match your other files using bcryptjs
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');
const jwtConfig = require('../config/jwt.config'); // Import JWT config

// Signup route
router.post('/signup', async (req, res) => {
    let connection;
    try {
        console.log('Request body received:', req.body);
        
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
        
        // Important: Use parameterized query with correct parameter order
        const insertQuery = 'INSERT INTO userInfo (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)';
        const params = [firstName, lastName, userName, email, hashedPassword];
        
        console.log('Executing query with params:', {
            firstName,
            lastName,
            userName,
            email,
            hashedPasswordLength: hashedPassword.length
        });
        
        const [result] = await connection.query(insertQuery, params);
        
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

// Login route - Modified to support both email and username login
router.post('/login', async (req, res) => {
    let connection;
    try {
        console.log('Login request body:', req.body);
        
        // Support both email and userName for login
        const { email, userName, password } = req.body;
        
        // Require either email or userName, plus password
        if ((!email && !userName) || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email/Username and password are required' 
            });
        }
        
        connection = await pool.getConnection();
        
        // Find user by email or username
        let query = 'SELECT id, firstName, lastName, username, email, password FROM userInfo WHERE ';
        let params = [];
        
        if (email) {
            query += 'email = ?';
            params.push(email);
        } else {
            query += 'username = ?';
            params.push(userName);
        }
        
        console.log('Executing query:', query, 'with params:', params);
        
        const [users] = await connection.query(query, params);
        
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
        
        console.log('User authenticated successfully. Generating token...');
        
        // Generate JWT token using the consistent JWT secret
        const token = jwt.sign(
            { id: user.id, email: user.email, userName: user.username },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
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