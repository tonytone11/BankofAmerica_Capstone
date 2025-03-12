import React, { useState, useEffect } from 'react';
import { searchPlayers } from '../services/FootballAPI'; // Adjust the import path as needed

const SearchBar = ({ onSelectPlayer }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        setLoading(true); // Show loading indicator

        try {
            const players = await searchPlayers(query); // Call your API function
            console.log('API Response:', players);

            setResults(players); // Update results state with fetched data
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    useEffect(() => {
        console.log('Results Updated:', results);
    }, [results]); // This will log whenever `results` changes

    // Handle player selection
    const handlePlayerClick = (player) => {
        // Check if onSelectPlayer exists before calling it
        if (typeof onSelectPlayer === 'function') {
            onSelectPlayer(player);
        } else {
            console.log('Player selected but no handler provided:', player);
            // You could implement fallback behavior here if needed
        }
        console.log('Player selected:', player);
    };

    return (
        <section className="search-container">
            <form onSubmit={handleSearch}>
                <div className="search-bar">
                    <div className="search-icon"></div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for players by name..."
                    />
                </div>
            </form>

            {loading ? (
                <p>Loading results...</p>
            ) : (
                results.length > 0 && (
                    <div className="search-results">
                        <ul>
                            {results.map((item) => (
                                <li
                                    className='player-info'
                                    key={item.player.id}
                                    onClick={() => handlePlayerClick(item)} // Add click handler
                                    style={{ cursor: 'pointer' }} // Make it look clickable
                                >
                                    {item.player.name}
                                    <img className='player-img1' src={item.player.photo} alt={item.player.name} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            )}
        </section>
    );
};

export default SearchBar;