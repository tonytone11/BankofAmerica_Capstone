import React, { useState, useEffect } from "react";
import data from './quotes.json' with { type: 'json' };

export default function Quotes() {
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Ensure data structure is valid
      if (!data || !data.players || data.players.length === 0) {
        throw new Error("No player data found.");
      }

      // Select a random player
      const randomPlayer = data.players[Math.floor(Math.random() * data.players.length)];
      setPlayer(randomPlayer);
    } catch (err) {
      console.error("Error fetching player data:", err.message);
      setError("Failed to load player data. Please try again.");
    }
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!player) return <p className="loading">Loading...</p>;

  return (
    <div className="card-content">
      <div className="-image">
        <img src={player.image_url} alt={player.name} className="player-images"/>
      </div>
      <div className="player-information">
        <h3>{player.name}</h3>
        <p className="player-team">{player.country}</p>
        <div className="player-quotes">
          {player.quotes.map((quoteItem, index) => (
            <div key={index} className="quote-item">
              <p className="player-quote">"{quoteItem.quote}"</p>
            </div>
          ))}
        </div>
        <p className="player-story">{player.career_summary}</p>
      </div>
    </div>
  );
}


