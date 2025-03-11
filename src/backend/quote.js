// const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';


// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
};

// Function to get a random daily inspiration combining player info and quotes
async function quotes() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Get a random player with their quote using JOIN
    const [rows] = await connection.execute(`
      SELECT 
        p.id,
        p.name,
        p.country,
        p.career_summary,
        p.image_url,
        q.quote
      FROM 
        soccer_players p
      JOIN 
        players_quotes q ON p.id = q.player_id
      ORDER BY RAND() 
      LIMIT 1
    `);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  } finally {
    if (connection) {
      connection.end();
    }
  }
};

 // Route to fetch quotes
 app.get('/quotes', async (req, res) => {
  try {
      const quoteData = await quotes(); // Get quote from database
      if (!quoteData) {
          return res.status(404).json({ error: 'No quotes found' });
      }
      res.json(quoteData);
  } catch (error) {
      console.error('Error fetching quotes:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

export { quotes };
