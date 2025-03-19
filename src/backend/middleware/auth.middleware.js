//auth.middleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    
    // Verify the token
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Save user data to request for use in other routes
        req.userId = decoded.id;
        req.userName = decoded.userName;
        
        next();
    });
};

module.exports = { verifyToken };