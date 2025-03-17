// const express = require('express');
// const app = express();
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const path = require('path');
// const PORT = process.env.PORT || 3003;
// require('dotenv').config();

// // Middleware setup
// app.use(cors({
//   origin: ['http://localhost:5173'],
//   methods: 'GET,POST,PUT,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type, Authorization',
//   waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
// }));
// // Add body parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // // Serve static files from the React build folder
// app.use(express.static(path.join(__dirname, '../../pages/Home')));

// // database connection pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     console.log(" Authorization Header:", authHeader); // Debugging

//     if (!authHeader) {
//         console.error(" Missing Authorization Header");
//         return res.status(401).json({ error: "Unauthorized - Missing token" });
//     }

//     const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
//     console.log(" Extracted Token:", token); // Debugging

//     if (!token) {
//         console.error(" Missing Token in Header");
//         return res.status(401).json({ error: "Unauthorized - No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error(" JWT Verification Failed:", err);
//             return res.status(403).json({ error: "Unauthorized - Invalid token" });
//         }

//         console.log(" Token Verified. Extracted id:", user.id);  //  Use "id" instead of "user_id"
//         req.user = user; // Attach user data to request
//         next();
//     });
// };


// // Route to log training hours
// app.post('/profile/practice-log', verifyToken, async (req, res) => {
//     let connection;
//     try {
//         const { date, hours } = req.body;
//         const userId = req.user.id;  //  Use "id" instead of "user_id"

//         connection = await pool.getConnection();

//         // Check if an entry already exists for that date
//         const [existingEntry] = await connection.query(
//             'SELECT * FROM hoursLogged WHERE user_id = ? AND date = ?',
//             [userId, date]
//         );

//         if (existingEntry.length > 0) {
//             // Update existing entry
//             await connection.query(
//                 'UPDATE hoursLogged SET hours = ? WHERE user_id = ? AND date = ?',
//                 [hours, userId, date]
//             );
//         } else {
//             // Insert new entry
//             await connection.query(
//                 'INSERT INTO hoursLogged (user_id, date, hours) VALUES (?, ?, ?)',
//                 [userId, date, hours]
//             );
//         }

//         res.status(200).json({ message: 'Hours logged successfully' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });

//     } finally {
//         if (connection) connection.release();
//     }
// });

// // Route to fetch user-specific training hours
// app.get('/profile/practice-log', verifyToken, async (req, res) => {
//     let connection;
//     try {
//         const userId = req.user.id;  //  Use "id" instead of "user_id"

//         connection = await pool.getConnection();
//         const [hoursData] = await connection.query(
//             'SELECT date, hours FROM hoursLogged WHERE user_id = ?',
//             [userId]
//         );

//         const formattedData = {};
//         hoursData.forEach(row => {
//             formattedData[row.date] = row.hours;
//         });

//         res.status(200).json(formattedData);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });

//     } finally {
//         if (connection) connection.release();
//     }
// });

// // POST route for contact form submissions with enhanced debugging
// app.post('/contact', async (req, res) => {
//     console.log('Received contact form submission:', req.body);
    
//     try {
//       // Extract form data from request body
//       const { adultName, childname, email, subject, message } = req.body;
      
//       console.log('Extracted fields:', { adultName, childname, email, subject, message });
      
//       // Validate required fields
//       if (!adultName || !email || !message) {
//         console.log('Validation failed - missing required fields');
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Please provide all required fields' 
//         });
//       }
      
//       // Get a connection from the pool
//       let connection;
//       try {
//         connection = await pool.getConnection();
//         console.log('Database connection established');
        
//         // Insert form data into contactForms table
//         const query = `
//           INSERT INTO contactForms 
//             (adultName, childname, email, subject, message) 
//           VALUES 
//             (?, ?, ?, ?, ?)
//         `;
        
//         console.log('Executing query:', query);
//         console.log('With values:', [adultName, childname, email, subject, message]);
        
//         const [result] = await connection.query(query, [adultName, childname, email, subject, message]);
        
//         console.log('Query result:', result);
        
//         // Check if insertion was successful
//         if (result.affectedRows === 1) {
//           // Successful submission
//           console.log('Message inserted successfully with ID:', result.insertId);
//           res.status(201).json({ 
//             success: true, 
//             message: 'Your message has been submitted successfully', 
//             id: result.insertId 
//           });
//         } else {
//           console.log('Insert operation did not affect any rows');
//           throw new Error('Failed to insert data');
//         }
//       } catch (dbError) {
//         console.error('Database operation error:', dbError);
//         throw dbError;
//       } finally {
//         if (connection) {
//           console.log('Releasing database connection');
//           connection.release();
//         }
//       }
//     } catch (error) {
//       console.error('Error details:', error);
//       // Log the full error details for debugging
//       console.error('Error name:', error.name);
//       console.error('Error message:', error.message);
//       console.error('Error stack:', error.stack);
      
//       res.status(500).json({ 
//         success: false, 
//         message: 'An error occurred while submitting your message. Please try again.',
//         debug: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
// });

// // get req displaying contact messages 
// app.get('/admin/users/messages', async (req, res) => {
//     try {
//       // SQL query to fetch all contact form submissions with full message
//       const query = `
//         SELECT id, adultName, childname, email, subject, message 
//         FROM contactForms 
//         ORDER BY id DESC
//       `;
      
//       const [messages] = await pool.query(query);
      
//       // For an API response
//       res.json({ success: true, messages });
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       res.status(500).json({ success: false, message: 'Failed to fetch messages' });
//     }
// });

// // // Mark message as read
// // app.post('/admin/messages/:id/read', async (req, res) => {
// //     try {
// //       const messageId = req.params.id;
// //       // Assuming you have a 'readMessage' column in your table
// //       const query = 'UPDATE contactForms SET readMessage = true WHERE id = ?';
// //       await pool.query(query, [messageId]);
      
// //       res.json({ success: true, message: 'Marked as read' });
// //     } catch (error) {
// //       console.error('Error marking message as read:', error);
// //       res.status(500).json({ success: false, message: 'Failed to update message status' });
// //     }
// // });

// // displaying user info on admin page, post req is done with the signup post route. just display info from userInfo table
// app.get('/admin/users', async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT id, name, username, email FROM userInfo ORDER BY id');
//       res.json(rows); // Send as JSON to frontend
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).send('Server error');
//     }
// });


// // Add a test endpoint 
// app.get('/test', (req, res) => {
//   res.json({ message: 'Test endpoint working' });
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));