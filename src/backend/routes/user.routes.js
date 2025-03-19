const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Unauthorized - Invalid token" });
        }
        
        req.user = user;
        next();
    });
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;
        
        connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT id, name, username, email FROM userInfo WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'User not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            user: users[0] 
        });
        
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch profile' 
        });
        
    } finally {
        if (connection) connection.release();
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;
        const { name, username, email } = req.body;
        
        connection = await pool.getConnection();
        
        // Update user information
        await connection.query(
            'UPDATE userInfo SET name = ?, username = ?, email = ? WHERE id = ?',
            [name, username, email, userId]
        );
        
        res.status(200).json({ 
            success: true, 
            message: 'Profile updated successfully' 
        });
        
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update profile' 
        });
        
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;