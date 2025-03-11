import React, { useState, useEffect } from 'react';
import { searchPlayers } from '../services/FootballAPI'; // Assuming `searchPlayers` is your API function

const SearchBar = () => {
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
            console.log('Results:', results);

        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    useEffect(() => {
        console.log('Results Updated:', results);
    }, [results]); // This will log whenever `results` changes


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
                                <li key={item.player.id}>{item.player.name}
                                    <img src={item.player.photo} /></li>
                            ))}
                        </ul>
                    </div>
                )
            )}
        </section>
    );
};

export default SearchBar;
