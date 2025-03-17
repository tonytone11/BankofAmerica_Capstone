//server.js
// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../pages/Home')));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Serve React Frontend (For any routes not matched)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/Home'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});