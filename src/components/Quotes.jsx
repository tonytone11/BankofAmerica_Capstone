import React, { useState, useEffect } from "react";
import data from './quotes.json' with { type: 'json' };

export default function RandomPlayer() {
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
    <div className="player-card">
      <img src={player.image_url} alt={player.name} className="player-image" />
      <h2>{player.name} ({player.country})</h2>
      <p><strong>Club:</strong> {player.club}</p>
      <p>{player.career_summary}</p>
      <h3>Quotes:</h3>
      <ul>
        {player.quotes.map((q, index) => (
          <li key={index}>
            "{q.quote}" <br /> <i>- {q.context}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
