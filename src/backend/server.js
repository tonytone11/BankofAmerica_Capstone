// server.js - Refactored to use auth middleware consistently and fix duplicate routes
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const adminRoutes = require('./routes/admin.routes');

// Load environment variables
dotenv.config();

// Import middleware
const { verifyToken } = require('./middleware/auth.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3003;

// Import database pool from config
const pool = require('./config/db.config');

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// Register auth and user routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


// Route to log training hours
app.post('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
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

        connection = await pool.getConnection();

        // Check if an entry already exists for that date
        const [existingEntry] = await connection.query(
            'SELECT * FROM hoursLogged WHERE user_id = ? AND date = ?',
            [userId, date]
        );

        let result;
        if (existingEntry.length > 0) {
            // Update existing entry
            console.log('Updating existing entry');
            [result] = await connection.query(
                'UPDATE hoursLogged SET hours = ? WHERE user_id = ? AND date = ?',
                [hours, userId, date]
            );

            console.log('Update result:', result);
        } else {
            // Insert new entry
            console.log('Creating new entry');
            [result] = await connection.query(
                'INSERT INTO hoursLogged (user_id, date, hours) VALUES (?, ?, ?)',
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
        if (connection) {
            console.log('Releasing database connection');
            connection.release();
        }
    }
});

// Route to fetch user-specific training hours (removed duplicate)
app.get('/profile/practice-log', verifyToken, async (req, res) => {
    let connection;
    try {
        const userId = req.user.id;
        console.log('Fetching hours for user:', userId);

        connection = await pool.getConnection();
        const [hoursData] = await connection.query(
            'SELECT date, hours FROM hoursLogged WHERE user_id = ?',
            [userId]
        );

        console.log('Retrieved hours data:', hoursData);

        // Format the data as expected by the frontend
        const formattedData = {};
        hoursData.forEach(row => {
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
        if (connection) {
            console.log('Releasing database connection');
            connection.release();
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
        let connection;
        try {
            connection = await pool.getConnection();
            console.log('Database connection established');

            // Insert form data into contactForms table
            const query = `
                INSERT INTO contactForms 
                (adultName, childName, email, subject, message) 
                VALUES (?, ?, ?, ?, ?)
            `;

            console.log('Executing query:', query);
            console.log('With values:', [adultName, childName, email, subject, message]);
            
            const [result] = await connection.query(query, [adultName, childName, email, subject, message]);
            
            console.log('Query result:', result);

            // Check if insertion was successful
            if (result.affectedRows === 1) {
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
            if (connection) {
                console.log('Releasing database connection');
                connection.release();
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

// get req displaying contact messages 




// displaying user info on admin page


// Routes for goals
app.post('/profile/goals', verifyToken, async (req, res) => {
    let connection;
    try {
      const { goal } = req.body;
      const userId = req.user.id;
  
      if (!goal) {
        return res.status(400).json({
          success: false,
          message: 'Goal text is required'
        });
      }
  
      connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO goals (user_id, goal) VALUES (?, ?)',
        [userId, goal]
      );
  
      res.status(201).json({
        success: true,
        message: 'Goal added successfully',
        id: result.insertId
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    } finally {
      if (connection) connection.release();
    }
  });
  
  app.get('/profile/goals', verifyToken, async (req, res) => {
    let connection;
    try {
      const userId = req.user.id;
  
      connection = await pool.getConnection();
      const [goals] = await connection.query(
        'SELECT id, goal, completed FROM goals WHERE user_id = ?',
        [userId]
      );
  
      res.status(200).json(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    } finally {
      if (connection) connection.release();
    }
  });
  
  app.put('/profile/goals/:id', verifyToken, async (req, res) => {
    let connection;
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

        connection = await pool.getConnection();
        
        // First verify the goal belongs to the user
        const [goalCheck] = await connection.query(
            'SELECT id FROM goals WHERE id = ? AND user_id = ?',
            [goalId, userId]
        );
        
        if (goalCheck.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found or unauthorized"
            });
        }

        // Ensure completed is stored as 0 or 1 in the database
        const completedStatus = completed ? 1 : 0;

        // Update the goal completion status
        const [result] = await connection.query(
            'UPDATE goals SET completed = ? WHERE id = ? AND user_id = ?',
            [completedStatus, goalId, userId]
        );

        console.log("Update result:", result);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not updated. It may not exist."
            });
        }

        res.status(200).json({
            success: true,
            message: "Goal updated successfully",
            completed: completedStatus
        });

    } catch (error) {
        console.error("Error updating goal:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });

    } finally {
        if (connection) {
            console.log("Releasing database connection");
            connection.release();
        }
    }
  });
  
  app.delete('/profile/goals/:id', verifyToken, async (req, res) => {
    let connection;
    try {
      const goalId = req.params.id;
      const userId = req.user.id;
  
      connection = await pool.getConnection();
      
      // First verify the goal belongs to this user
      const [goal] = await connection.query(
        'SELECT * FROM goals WHERE id = ? AND user_id = ?',
        [goalId, userId]
      );
  
      if (goal.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found or unauthorized'
        });
      }
  
      await connection.query(
        'DELETE FROM goals WHERE id = ?',
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
      if (connection) connection.release();
    }
  });

// Catch-all route should be LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});