// Import required modules
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001; // Backend should run on a different port than React
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
app.use(cors({
    origin: 'http://localhost:3001', // React's development server URL
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization', // Allow Authorization header for JWT
}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../../pages/Home')));

// **Database Connection**
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [results] = await connection.promise().query(
            'INSERT INTO userInfo (firstName, lastName, userName, email, password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, userName, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registration successful!', redirectUrl: '/login' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email or Username already exists.' });
        }
        res.status(500).json({ error: 'Internal server error, please try again later.' });
    }
});

// **Login Route**
app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const [results] = await connection.promise().query(
            'SELECT * FROM userInfo WHERE userName = ?',
            [userName]
        );

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, userName: user.userName }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: `Welcome ${user.firstName}`, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// **Serve React Frontend (For any routes not matched)**
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../pages/Home'));
});

// **Start Server**
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
