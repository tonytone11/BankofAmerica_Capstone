const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config();
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// **Database Connection**
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'your-database-host',
    user: process.env.DB_USER || 'your-database-user',
    password: process.env.DB_PASS || 'your-database-password',
    database: process.env.DB_NAME || 'your-database-name'
});

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
        const { firstName, lastName, userName, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const [results] = await connection.promise().query(
            'INSERT INTO signup (firstName, lastName, userName, email, password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, userName, email, hashedPassword]
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
            'SELECT * FROM signup WHERE userName = ?',
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
        const token = jwt.sign({ id: user.id, userName: user.userName }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: `Welcome ${user.firstName}`, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// **Routes to Serve Pages**
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'Home', 'Home.jsx'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'registration', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'registration', 'signup.jsx'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'AboutUs', 'about.jsx'));
});

app.get('/progress', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'progress', 'progress.jsx'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Contact', 'contact.jsx'));
});

app.get('/training', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Training', 'training.jsx'));
});

// **Start Server**
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
