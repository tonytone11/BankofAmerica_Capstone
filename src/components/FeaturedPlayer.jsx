import React, { useEffect, useState } from 'react';
import '../styles/FeaturedPlayer.css';
import { getPlayerStatistics } from '../services/FootballAPI';

const FeaturedPlayer = ({ selectedPlayer }) => {
    const [playerStats, setPlayerStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch player statistics when a player is selected
    useEffect(() => {
        const fetchPlayerStats = async () => {
            if (selectedPlayer && selectedPlayer.player && selectedPlayer.player.id) {
                setLoading(true);
                try {
                    const stats = await getPlayerStatistics(selectedPlayer.player.id);
                    setPlayerStats(stats);
                } catch (error) {
                    console.error('Error fetching player statistics:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPlayerStats();
    }, [selectedPlayer]);

    // If no player is selected, show a placeholder
    if (!selectedPlayer) {
        return (
            <section className="featured-player">
                <div className="placeholder">Search for a player above to view details</div>
            </section>
        );
    }

    // Destructure player data for easier access
    const { player } = selectedPlayer;

    // Get statistics from API call if available, or fall back to passed-in statistics
    const stats = playerStats && playerStats.length > 0
        ? playerStats[0].statistics[0]
        : (selectedPlayer.statistics && selectedPlayer.statistics.length > 0
            ? selectedPlayer.statistics[0]
            : null);

    return (
        <section className="featured-player">
            {loading && <div className="loading-indicator">Loading statistics...</div>}

            <div className="player-photo">
                <img
                    src={player.photo}
                    alt={player.name}
                    className="player-img"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://www.sportsgamingwire.com/wp-content/uploads/2023/09/ea-sports-fc24.jpg"; // Fallback image
                    }}
                />
            </div>

            <div className="player-details">
                <h2>{player.firstname} {player.lastname}</h2>
                <div className="player-tag">
                    {stats?.team?.name || 'Team N/A'} • {player.nationality || 'Nationality N/A'}
                </div>

                <div className="player-stats">
                    <p> <strong> Position: </strong> {stats?.games?.position || player.position || 'N/A'}</p>
                    <p> <strong> Age: </strong> {player.age || 'N/A'}</p>
                    <p> <strong> Goals: </strong>  {stats?.goals?.total || 'N/A'}</p>
                    <p> <strong> Assists: </strong> {stats?.goals?.assists || 'N/A'}</p>
                    <p> <strong> Appearances: </strong>  {stats?.games?.appearences || 'N/A'}</p>
                </div>
            </div>

            <div className="player-save">
                <button className="bookmark-button">+ Bookmark Player</button>
            </div>
        </section>
    );
};

export default FeaturedPlayer;