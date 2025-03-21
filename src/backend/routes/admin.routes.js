// routes/admin.routes.js - Updated for PostgreSQL compatibility
const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { verifyToken } = require('../middleware/auth.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');

// Get all users for admin view
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        console.log('Admin fetching all users...');

        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    id, 
                    CONCAT(firstName, ' ', lastName) AS name, 
                    username, 
                    email,
                    isAdmin
                FROM userInfo 
                ORDER BY id
            `);

            console.log(`Successfully fetched ${result.rowCount} users`);
            res.status(200).json({
                success: true,
                users: result.rows
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message
        });
    }
});

// Get all messages for admin view
router.get('/messages', verifyToken, verifyAdmin, async (req, res) => {
    try {
        console.log('Admin fetching all messages...');

        const client = await pool.connect();
        try {
            // PostgreSQL syntax for IFNULL -> COALESCE and date formatting
            const result = await client.query(`
                SELECT id, adultName, childName, email, subject, message, 
                       COALESCE(readstatus, FALSE) as readStatus,
                       TO_CHAR(created_at, 'YYYY-MM-DD') as date
                FROM contactForms 
                ORDER BY id DESC
            `);

            console.log(`Successfully fetched ${result.rowCount} messages`);
            res.status(200).json({
                success: true,
                messages: result.rows
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
});

// Mark message as read
router.put('/messages/:id/read', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const messageId = req.params.id;
        console.log('Admin marking message as read, ID:', messageId);

        const client = await pool.connect();
        try {
            // Check if the message exists
            const checkResult = await client.query(
                'SELECT id FROM contactForms WHERE id = $1',
                [messageId]
            );

            if (checkResult.rowCount === 0) {
                console.log('Message not found in database');
                return res.status(404).json({
                    success: false,
                    message: 'Message not found'
                });
            }

            // Update the message status
            const result = await client.query(
                'UPDATE contactForms SET readstatus = TRUE WHERE id = $1',
                [messageId]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to update message'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Message marked as read'
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update message',
            error: error.message
        });
    }
});

// Promote user to admin
router.put('/users/:id/promote', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Promoting user to admin, ID:', userId);

        const client = await pool.connect();
        try {
            // Check if the user exists
            const checkResult = await client.query(
                'SELECT id FROM userInfo WHERE id = $1',
                [userId]
            );

            if (checkResult.rowCount === 0) {
                console.log('User not found in database');
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Update the user's admin status
            const result = await client.query(
                'UPDATE userInfo SET isAdmin = TRUE WHERE id = $1',
                [userId]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to update user'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User promoted to admin successfully'
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to promote user',
            error: error.message
        });
    }
});

// Demote admin to regular user
router.put('/users/:id/demote', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        // Prevent self-demotion
        if (userId == adminId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot demote yourself'
            });
        }

        console.log('Demoting admin to regular user, ID:', userId);

        const client = await pool.connect();
        try {
            // Check if the user exists
            const checkResult = await client.query(
                'SELECT id FROM userInfo WHERE id = $1',
                [userId]
            );

            if (checkResult.rowCount === 0) {
                console.log('User not found in database');
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Update the user's admin status
            const result = await client.query(
                'UPDATE userInfo SET isAdmin = FALSE WHERE id = $1',
                [userId]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to update user'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User demoted from admin successfully'
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error demoting user from admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to demote user',
            error: error.message
        });
    }
});

module.exports = router;