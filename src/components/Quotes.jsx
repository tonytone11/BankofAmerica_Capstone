// Frontend React component (DailyInspiration.jsx)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Quotes() {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/quotes');
        setPlayerData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch daily inspiration:', err);
        setError('Failed to load player inspiration. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) return <div className="loading">Loading inspiration...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!playerData) return <div className="no-data">No inspiration available today.</div>;

  return (
    <div className="player-inspiration-card">
      <div className="player-image">
        {playerData.image_url && (
          <img src={playerData.image_url} alt={playerData.name} />
        )}
      </div>
      <div className="player-info">
        <h3>{playerData.name}</h3>
        <div className="player-team">{playerData.country}</div>
        <div className="player-quote">"{playerData.quote}"</div>
        <div className="player-story">{playerData.career_summary}</div>
      </div>
    </div>
  );
};


// Backend API endpoint (in your routes file where other API endpoints are defined)
// Add this route to your existing Express router

// Assuming you already have something like this in your app:
// const db = require('../path/to/your/existing/db-connection');

// router.get('/api/daily-inspiration', async (req, res) => {
//   try {
//     // Use your existing database connection
//     // This assumes you have a function or method to execute queries
//     const result = await db.query(`
//       SELECT 
//         p.id,
//         p.name,
//         p.country,
//         p.career_summary,
//         p.image_url,
//         q.quote
//       FROM 
//         soccer_players p
//       JOIN 
//         players_quotes q ON p.id = q.player_id
//       ORDER BY RAND() 
//       LIMIT 1
//     `);
    
//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No inspiration found' });
//     }
    
//     res.json(result[0]);
//   } catch (error) {
//     console.error('Error fetching daily inspiration:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Note: The above assumes your db connection handles closing connections automatically
// // If not, make sure to properly close connections after use