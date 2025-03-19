// middleware/auth.middleware.js - Refactored to use the jwt config consistently
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        console.error("Missing Authorization Header");
        return res.status(401).json({ error: "Unauthorized - Missing token" });
    }
    
    const token = authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        console.error("Missing Token in Header");
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }
    
    // Use the jwt config secret consistently
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Failed:", err);
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }
        
        // Save user data to request for use in other routes
        req.user = decoded;
        console.log("Token Verified. User data:", req.user);
        next();
    });
};

module.exports = { verifyToken };