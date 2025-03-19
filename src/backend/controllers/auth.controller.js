// In controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwt.config');
const pool = require('../config/db.config');

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, position } = req.body;
        
        // Check if user already exists
        const [existingUsers] = await pool.execute(
            "SELECT * FROM userinfo WHERE userName = ? OR email = ?", 
            [userName, email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email or Username already exists.' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user into the database
        const [result] = await pool.execute(
            "INSERT INTO userinfo (firstName, lastName, userName, email, position, password) VALUES (?, ?, ?, ?, ?, ?)",
            [firstName, lastName, userName, email, position || null, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'Registration successful!', 
            redirectUrl: '/login',
            userId: result.insertId
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        
        // Find user in database
        const [users] = await pool.execute(
            "SELECT * FROM userinfo WHERE userName = ?", 
            [userName]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            // Create JWT token
            const token = jwt.sign(
                { id: user.id, userName: user.userName },
                jwtConfig.secret,
                { expiresIn: jwtConfig.expiresIn }
            );
            
            res.status(200).json({
                message: `Welcome ${user.firstName}!`,
                lastName: user.lastName,
                firstName: user.firstName,
                email: user.email,
                position: user.position,
                token: token
            });
        } else {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};