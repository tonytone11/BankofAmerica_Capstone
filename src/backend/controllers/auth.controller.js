// // In controllers/auth.controller.js - simplified version without database
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const jwtConfig = require('../config/jwt.config');

// // Mock user storage (just for testing)
// const users = [];

// exports.signup = async (req, res) => {
//     try {
//         const { firstName, lastName, userName, email, password } = req.body;
        
//         // Check if user already exists
//         if (users.find(u => u.userName === userName || u.email === email)) {
//             return res.status(400).json({ error: 'Email or Username already exists.' });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // Store user in memory (for testing only)
//         const newUser = {
//             id: users.length + 1,
//             firstName,
//             lastName,
//             userName,
//             email,
//             password: hashedPassword
//         };
        
//         users.push(newUser);
        
//         res.status(201).json({ message: 'Registration successful!', redirectUrl: '/login' });
//     } catch (error) {
//         console.error("Signup error:", error);
//         res.status(500).json({ error: 'Internal server error: ' + error.message });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { userName, password } = req.body;
        
//         // Find user
//         const user = users.find(u => u.userName === userName);
        
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }
        
//         const isMatch = await bcrypt.compare(password, user.password);
        
//         if (isMatch) {
//             // Create JWT token
//             const token = jwt.sign(
//                 { id: user.id, userName: user.userName },
//                 jwtConfig.secret,
//                 { expiresIn: jwtConfig.expiresIn }
//             );
            
//             res.status(200).json({
//                 message: `Welcome ${user.firstName}!`,
//                 lastName: user.lastName,
//                 firstName: user.firstName,
//                 email: user.email,
//                 token: token
//             });
//         } else {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }
//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ error: 'Internal server error: ' + error.message });
//     }
// };