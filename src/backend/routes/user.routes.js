// routes/user.routes.js - Refactored to use the middleware
const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { verifyToken } = require('../middleware/auth.middleware');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;
        
        connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT id, firstName, lastName, username, email FROM userInfo WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'User not found' 
            });
        }
        
        // Format the user data for response
        const user = users[0];
        res.status(200).json({ 
            success: true, 
            user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                username: user.username,
                email: user.email
            }
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
        const { firstName, lastName, username, email } = req.body;
        
        // Validate inputs
        if (!firstName || !lastName || !username || !email) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        connection = await pool.getConnection();
        
        // Update user information
        await connection.query(
            'UPDATE userInfo SET firstName = ?, lastName = ?, username = ?, email = ? WHERE id = ?',
            [firstName, lastName, username, email, userId]
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