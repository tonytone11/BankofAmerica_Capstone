// server.js - Updated for PostgreSQL compatibility
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/admin.routes');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Import middleware
const { verifyToken } = require('./middleware/auth.middleware');
const createYoutubeMiddleware = require('./middleware/youtube.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3003;

// Import database pool from config
const pool = require('./config/db.config');

// Test database connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
  } catch (error) {
    console.error('Initial database connection test failed:', error);
  }
})();

const youtubeMiddleware = createYoutubeMiddleware(process.env.YOUTUBE_API_KEY);

// Middleware setup
app.use(cors({
  origin: 'https://bankofamerica-capstone.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));

// Register auth and user routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/youtube/search', youtubeMiddleware.searchVideos);
app.get('/api/youtube/videos', youtubeMiddleware.getVideoDetails);

// Route to log training hours
app.post('/profile/practice-log', verifyToken, async (req, res) => {
  let client;
  try {
    const { date, hours } = req.body;

    if (!date || hours === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Date and hours are required'
      });
    }

    const userId = req.user.id;
    console.log('Logging hours for user:', userId, 'Date:', date, 'Hours:', hours);

    client = await pool.connect();

    // Check if an entry already exists for that date
    const existingEntry = await client.query(
      'SELECT * FROM hoursLogged WHERE user_id = $1 AND date = $2',
      [userId, date]
    );

    let result;
    if (existingEntry.rowCount > 0) {
      // Update existing entry
      console.log('Updating existing entry');
      result = await client.query(
        'UPDATE hoursLogged SET hours = $1 WHERE user_id = $2 AND date = $3',
        [hours, userId, date]
      );

      console.log('Update result:', result);
    } else {
      // Insert new entry
      console.log('Creating new entry');
      result = await client.query(
        'INSERT INTO hoursLogged (user_id, date, hours) VALUES ($1, $2, $3)',
        [userId, date, hours]
      );

      console.log('Insert result:', result);
    }

    res.status(200).json({
      success: true,
      message: 'Hours logged successfully'
    });

  } catch (error) {
    console.error('Error logging hours:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });

  } finally {
    if (client) {
      console.log('Releasing database connection');
      client.release();
    }
  }
});

// Route to fetch user-specific training hours
app.get('/profile/practice-log', verifyToken, async (req, res) => {
  let client;
  try {
    const userId = req.user.id;
    console.log('Fetching hours for user:', userId);

    client = await pool.connect();
    const hoursData = await client.query(
      'SELECT date, hours FROM hoursLogged WHERE user_id = $1',
      [userId]
    );

    console.log('Retrieved hours data:', hoursData.rows);

    // Format the data as expected by the frontend
    const formattedData = {};
    hoursData.rows.forEach(row => {
      // Format date as YYYY-MM-DD string for use as object key
      const dateKey = row.date.toISOString().split('T')[0];
      formattedData[dateKey] = parseFloat(row.hours);
    });

    console.log('Formatted data for frontend:', formattedData);
    res.status(200).json(formattedData);

  } catch (error) {
    console.error('Error fetching hours:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });

  } finally {
    if (client) {
      console.log('Releasing database connection');
      client.release();
    }
  }
});

// POST route for contact form submissions
app.post('/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);

  try {
    // Extract form data from request body
    const { adultName, childName, email, subject, message } = req.body;

    console.log('Extracted fields:', { adultName, childName, email, subject, message });

    // Validate required fields
    if (!adultName || !email || !message) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get a connection from the pool
    let client;
    try {
      client = await pool.connect();
      console.log('Database connection established');

      // Insert form data into contactForms table with PostgreSQL syntax
      const query = `
        INSERT INTO contactForms 
        (adultName, childName, email, subject, message) 
        VALUES ($1, $2, $3, $4, $5)
      `;

      console.log('Executing query:', query);
      console.log('With values:', [adultName, childName, email, subject, message]);

      const result = await client.query(query, [adultName, childName, email, subject, message]);

      console.log('Query result:', result);

      // Check if insertion was successful
      if (result.rowCount === 1) {
        // Successful submission
        res.status(201).json({
          success: true,
          message: 'Your message has been submitted successfully'
        });
      } else {
        console.log('Insert operation did not affect any rows');
        throw new Error('Failed to insert data');
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      throw dbError;
    } finally {
      if (client) {
        console.log('Releasing database connection');
        client.release();
      }
    }
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your message. Please try again.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes for goals
app.post('/profile/goals', verifyToken, async (req, res) => {
  let client;
  try {
    const { goal } = req.body;
    const userId = req.user.id;

    if (!goal) {
      return res.status(400).json({
        success: false,
        message: 'Goal text is required'
      });
    }

    client = await pool.connect();
    const result = await client.query(
      'INSERT INTO goals (user_id, goal) VALUES ($1, $2) RETURNING id',
      [userId, goal]
    );

    res.status(201).json({
      success: true,
      message: 'Goal added successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  } finally {
    if (client) client.release();
  }
});

app.get('/profile/goals', verifyToken, async (req, res) => {
  let client;
  try {
    const userId = req.user.id;

    client = await pool.connect();
    const goals = await client.query(
      'SELECT id, goal, completed FROM goals WHERE user_id = $1',
      [userId]
    );

    res.status(200).json(goals.rows);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  } finally {
    if (client) client.release();
  }
});

app.put('/profile/goals/:id', verifyToken, async (req, res) => {
  let client;
  try {
    const goalId = req.params.id;
    const userId = req.user.id;
    const { completed } = req.body;

    console.log(`Updating goal ID: ${goalId} for user ID: ${userId}, New completed status: ${completed}`);

    if (completed === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing 'completed' field in request body"
      });
    }

    client = await pool.connect();

    // First verify the goal belongs to the user
    const goalCheck = await client.query(
      'SELECT id FROM goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );

    if (goalCheck.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Goal not found or unauthorized"
      });
    }

    // Update the goal completion status - PostgreSQL handles boolean directly
    const result = await client.query(
      'UPDATE goals SET completed = $1 WHERE id = $2 AND user_id = $3',
      [completed, goalId, userId]
    );

    console.log("Update result:", result);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Goal not updated. It may not exist."
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      completed: completed
    });

  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });

  } finally {
    if (client) {
      console.log("Releasing database connection");
      client.release();
    }
  }
});

app.delete('/profile/goals/:id', verifyToken, async (req, res) => {
  let client;
  try {
    const goalId = req.params.id;
    const userId = req.user.id;

    client = await pool.connect();

    // First verify the goal belongs to this user
    const goal = await client.query(
      'SELECT * FROM goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );

    if (goal.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found or unauthorized'
      });
    }

    await client.query(
      'DELETE FROM goals WHERE id = $1',
      [goalId]
    );

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  } finally {
    if (client) client.release();
  }
});

// Add this to your server.js or app.js
app.get('/api/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as time');
    client.release();
    res.json({
      success: true,
      message: 'Database connection successful',
      result: result.rows[0]
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// Catch-all route should be LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});