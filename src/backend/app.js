// Import required modules
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Fix for frontend-backend communication
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the React build folder
app.use(express.static( 'pages'));

// **Database Connection**
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// **Register Route**
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, userName, email, phoneNumber, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const [results] = await connection.promise().query(
            'INSERT INTO userInfo (firstName, lastName, userName, email,phoneNumber, password) VALUES (?, ?, ?, ?, ?,?)',
            [firstName, lastName, userName, email, phoneNumber, hashedPassword]
        );

        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.log(error);

        // Check for duplicate email
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

// **Login Route**
app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Fetch user from DB
        const [results] = await connection.promise().query(
            'SELECT * FROM userInfo WHERE userName = ?',
            [userName]
        );

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, userName: user.userName }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: `Welcome ${user.firstName}`, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// **Serve React Frontend**
app.get('*', (req, res) => {
    res.sendFile(path.join('pages', 'Home.jsx'));
});

// **Start Server**
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
