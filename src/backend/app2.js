// // Import required modules
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3001;
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const mysql = require('mysql2/promise'); // Import promise-based mysql2
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const path = require('path');

// // Load environment variables from .env file
// dotenv.config();

// // Middleware setup
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: 'GET,POST',
//     allowedHeaders: 'Content-Type, Authorization',
// }));
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Serve static files from the React build folder
// app.use(express.static(path.join(__dirname, '../../pages/Home')));

// // **Database Connection Pool**
// const pool = mysql.createPool({ // Create connection pool
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// // **Register Route**
// app.post('/signup', async (req, res) => {
//     let connection; // Declare connection variable
//     try {
//         const { firstName, lastName, userName, email, password,  position } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         connection = await pool.getConnection(); // Get connection from pool
//         const [results] = await connection.query(
//             'INSERT INTO userInfo (firstName, lastName, userName, email, password, position) VALUES (?, ?, ?, ?, ?, ?)',
//             [firstName, lastName, userName, email, hashedPassword, position]
//         );

//         res.status(201).json({ message: 'Registration successful!', redirectUrl: '/login' });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ error: 'Email or Username already exists.' });
//         }
//         res.status(500).json({ error: 'Internal server error, please try again later.' });
//     } finally {
//         if (connection) connection.release(); // Release connection back to pool
//     }
// });



// // **Login Route**
// app.post('/login', async (req, res) => {
//     let connection;
//     try {
//         const { userName, password } = req.body;
//         connection = await pool.getConnection();
//         const [results] = await connection.query(
//             'SELECT * FROM userInfo WHERE userName = ?',
//             [userName]
//         );

//         if (results.length === 0) {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }

//         const user = results[0];
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (isMatch) {
//             console.log("ismatch", password, user.password); // Changed hashedPassword to user.password, as that is what is stored.

//             // saving name in session storage - sending data back to the client.
//             res.send({
//                 message: `Welcome ${user.firstName}!`, // use user.firstName
//                 lastName: user.lastName, // use user.lastName
//                 firstName: user.firstName, // use user.firstName
//                 email: user.email, // use user.email
//                 phoneNumber: user.phoneNumber, // use user.phoneNumber.
//             });
//         } else {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal server error' });
//     } finally {
//         if (connection) connection.release();
//     }
// });

// // ... (rest of your code) ...
     

// // **Serve React Frontend (For any routes not matched)**
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../pages/Home'));
// });

// // **Start Server**
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });