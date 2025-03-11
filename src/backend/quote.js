const mysql = require('mysql2/promise');

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
}

// // Example usage in your frontend React component
// async function updateQoutes() {
//   try {
//     const playerData = awaitquotes();
    
//     if (playerData) {
//       // Update your component state or DOM elements
//       document.querySelector('.player-info h3').textContent = playerData.name;
//       document.querySelector('.player-team').textContent = playerData.country;
//       document.querySelector('.player-quote').textContent = `"${playerData.quote}"`;
//       document.querySelector('.player-story').textContent = playerData.career_summary;
      
//       // If you have an image element
//       if (playerData.image_url) {
//         document.querySelector('.player-image img').src = playerData.image_url;
//         document.querySelector('.player-image img').alt = playerData.name;
//       }
//     }
//   } catch (error) {
//     console.error('Failed to update quotes:', error);
//   }
// }

// Export functions if using modules
module.exports = {
 quotes
};