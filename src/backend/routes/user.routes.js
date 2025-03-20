// routes/user.routes.js - Updated for PostgreSQL compatibility
const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { verifyToken } = require('../middleware/auth.middleware');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    let client;
    try {
        const userId = req.user.id;

        client = await pool.connect();
        const result = await client.query(
            'SELECT id, firstName, lastName, username, email FROM userInfo WHERE id = $1',
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Format the user data for response
        const user = result.rows[0];
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: `${user.firstname} ${user.lastname}`, // Note: PostgreSQL column names are lowercase
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
        if (client) client.release();
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    let client;
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

        client = await pool.connect();

        // Update user information
        const result = await client.query(
            'UPDATE userInfo SET firstName = $1, lastName = $2, username = $3, email = $4 WHERE id = $5',
            [firstName, lastName, username, email, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile',
            message: error.message
        });

    } finally {
        if (client) client.release();
    }
});

module.exports = router;