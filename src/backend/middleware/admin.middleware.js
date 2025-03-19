// middleware/admin.middleware.js - Middleware to check admin privileges
const pool = require('../config/db.config');

const verifyAdmin = async (req, res, next) => {
    try {
        // Check if user is authenticated first
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false, 
                error: "Unauthorized - Authentication required" 
            });
        }
        
        const userId = req.user.id;
        console.log("Checking admin privileges for user:", userId);
        
        // Get a connection from the pool
        const connection = await pool.getConnection();
        
        try {
            // Check if the user has admin privileges
            const [users] = await connection.query(
                'SELECT isAdmin FROM userInfo WHERE id = ?', 
                [userId]
            );
            
            if (users.length === 0) {
                console.log("User not found:", userId);
                return res.status(404).json({ 
                    success: false, 
                    error: "User not found" 
                });
            }
            
            const isAdmin = users[0].isAdmin;
            console.log("User admin status:", isAdmin);
            
            if (!isAdmin) {
                console.log("Access denied: User is not an admin");
                return res.status(403).json({ 
                    success: false, 
                    error: "Access denied - Admin privileges required" 
                });
            }
            
            // User is an admin, proceed to the next middleware/route handler
            console.log("Admin access granted for user:", userId);
            next();
            
        } finally {
            // Release the connection back to the pool
            connection.release();
        }
        
    } catch (error) {
        console.error("Error verifying admin status:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal server error", 
            message: error.message 
        });
    }
};

module.exports = { verifyAdmin };