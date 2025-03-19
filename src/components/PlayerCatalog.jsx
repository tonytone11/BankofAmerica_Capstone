import { useState, useEffect } from 'react';
import '../styles/PlayerCatalog.css'
import { getPlayerById } from '../services/FootballAPI';

const PlayerCatalog = ({ playerId, onSelectPlayer }) => {
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            setLoading(true);
            try {
                const data = await getPlayerById(playerId);
                if (data) {
                    setPlayer(data);
                } else {
                    setError('Player not found');
                }
            } catch (error) {
                setError(`Failed to load player data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [playerId]);

    const handlePlayerClick = () => {
        // Check if onSelectPlayer exists before calling it
        if (typeof onSelectPlayer === 'function' && player) {
            onSelectPlayer({
                player: player,
                statistics: []
            });
        } else {
            console.log('Player selected but no handler provided:', player);
        }
        console.log('Player selected:', player);
    };

    if (loading) return <div>Loading player info...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!player) return <div>No player data found</div>;

    return (
        <div className="popular-player-card"
            onClick={handlePlayerClick}>
            <div className="popular-player-avatar">
                {player.photo && (
                    <img
                        src={player.photo}
                        alt={player.name}
                        onError={(e) => { e.target.src = '/placeholder-player.png' }}
                    />
                )}
            </div>
            <h3>{player.name}</h3>
            <p>{player.position} • {player.nationality}</p>
        </div>
    );
};

export default PlayerCatalog;