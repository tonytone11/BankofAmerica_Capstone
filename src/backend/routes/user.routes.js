const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');

// Protected route example
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // req.userId and req.userName are available from the middleware
        res.status(200).json({
            message: 'Profile access successful',
            userName: req.userName
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;