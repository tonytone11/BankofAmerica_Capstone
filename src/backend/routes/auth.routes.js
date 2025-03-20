// routes/auth.routes.js - Updated for PostgreSQL compatibility
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config');
const jwtConfig = require('../config/jwt.config');

// Signup route
router.post('/signup', async (req, res) => {
    let client;
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

        client = await pool.connect();

        // Check if username already exists - note the LOWER() for case insensitivity
        const existingUsername = await client.query(
            'SELECT * FROM userInfo WHERE LOWER(username) = LOWER($1)',
            [userName]
        );

        if (existingUsername.rowCount > 0) {
            return res.status(409).json({
                success: false,
                error: 'Username already exists'
            });
        }

        // Check if email already exists
        const existingEmail = await client.query(
            'SELECT * FROM userInfo WHERE LOWER(email) = LOWER($1)',
            [email]
        );

        if (existingEmail.rowCount > 0) {
            return res.status(409).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user with PostgreSQL syntax using $n parameters
        const result = await client.query(
            'INSERT INTO userInfo (firstName, lastName, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [firstName, lastName, userName, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.rows[0].id
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed',
            details: error.message
        });

    } finally {
        if (client) client.release();
    }
});

// Login route
router.post('/login', async (req, res) => {
    let client;

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

        client = await pool.connect();

        // Find user by email or username with PostgreSQL syntax
        let query = 'SELECT id, firstName, lastName, username, email, password, isAdmin FROM userInfo WHERE ';
        let params = [];

        if (email) {
            query += 'LOWER(email) = LOWER($1)';
            params.push(email);
        } else {
            query += 'LOWER(username) = LOWER($1)';
            params.push(userName);
        }

        console.log('Executing query:', query, 'with params:', params);

        const result = await client.query(query, params);

        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Add debug logging
        console.log('User from database:', user);
        console.log('Admin field from DB:', user.isadmin);
        console.log('Admin field type:', typeof user.isadmin);

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        console.log('User authenticated successfully. Generating token...');

        // Convert admin field to boolean - PostgreSQL will return a true boolean
        const isAdmin = Boolean(user.isadmin);
        console.log('Converted admin value:', isAdmin);

        // Generate JWT token with admin status included
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                userName: user.username,
                isAdmin: isAdmin
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstname, // Note the lowercase - PostgreSQL default behavior
                lastName: user.lastname,   // Note the lowercase - PostgreSQL default behavior
                username: user.username,
                email: user.email,
                isAdmin: isAdmin
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
        if (client) client.release();
    }
});

module.exports = router;