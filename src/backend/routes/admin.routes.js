// routes/admin.routes.js - Routes for admin functionality
const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { verifyToken } = require('../middleware/auth.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');

// Get all users for admin view
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        console.log('Admin fetching all users...');
        
        const [rows] = await pool.query(`
            SELECT 
                id, 
                CONCAT(firstName, ' ', lastName) AS name, 
                username, 
                email,
                isAdmin
            FROM userInfo 
            ORDER BY id
        `);
        
        console.log(`Successfully fetched ${rows.length} users`);
        res.status(200).json({ 
            success: true,
            users: rows 
        });
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
        
        const [messages] = await pool.query(`
            SELECT id, adultName, childName, email, subject, message, 
                   IFNULL(readStatus, FALSE) as readMessages,
                   DATE_FORMAT(created_at, '%Y-%m-%d') as date
            FROM contactForms 
            ORDER BY id DESC
        `);
        
        console.log(`Successfully fetched ${messages.length} messages`);
        res.status(200).json({ 
            success: true, 
            messages 
        });
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
        
        // Check if the message exists
        const [checkResult] = await pool.query(
            'SELECT id FROM contactForms WHERE id = ?', 
            [messageId]
        );
        
        if (checkResult.length === 0) {
            console.log('Message not found in database');
            return res.status(404).json({ 
                success: false, 
                message: 'Message not found' 
            });
        }
        
        // Update the message status
        const [result] = await pool.query(
            'UPDATE contactForms SET readStatus = TRUE WHERE id = ?',
            [messageId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Failed to update message' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Message marked as read' 
        });
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
        
        // Check if the user exists
        const [checkResult] = await pool.query(
            'SELECT id FROM userInfo WHERE id = ?', 
            [userId]
        );
        
        if (checkResult.length === 0) {
            console.log('User not found in database');
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Update the user's admin status
        const [result] = await pool.query(
            'UPDATE userInfo SET isAdmin = TRUE WHERE id = ?',
            [userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Failed to update user' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'User promoted to admin successfully' 
        });
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
        
        // Check if the user exists
        const [checkResult] = await pool.query(
            'SELECT id FROM userInfo WHERE id = ?', 
            [userId]
        );
        
        if (checkResult.length === 0) {
            console.log('User not found in database');
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Update the user's admin status
        const [result] = await pool.query(
            'UPDATE userInfo SET isAdmin = FALSE WHERE id = ?',
            [userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Failed to update user' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'User demoted from admin successfully' 
        });
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