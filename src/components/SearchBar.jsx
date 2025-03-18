import React, { useState, useEffect } from 'react';
import '../styles/SearchBar.css';
import { searchPlayers } from '../services/FootballAPI';

const SearchBar = ({ onSelectPlayer }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading indicator
        setCurrentPage(1); // Reset to first page on new search

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

        // Clear the results after a player is selected
        setResults([]);
        // Also clear the search query
        setQuery('');
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(results.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="player-search-container">
            <form onSubmit={handleSearch}>
                <div className="player-search-bar">
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
                    <div className="player-search-results">
                        <ul>
                            {currentItems.map((item) => (
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

                        {results.length > itemsPerPage && (
                            <div className="search-pagination">
                                <div className="page-numbers">
                                    {(() => {
                                        // Determine which page numbers to show
                                        let pageNumbers = [];

                                        if (totalPages <= 3) {
                                            // If there are 3 or fewer pages, show all of them
                                            pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
                                        } else if (currentPage === 1) {
                                            // If on first page, show pages 1, 2, 3
                                            pageNumbers = [1, 2, 3];
                                        } else if (currentPage === totalPages) {
                                            // If on last page, show last 3 pages
                                            pageNumbers = [totalPages - 2, totalPages - 1, totalPages];
                                        } else {
                                            // Otherwise show previous, current, next
                                            pageNumbers = [currentPage - 1, currentPage, currentPage + 1];
                                        }

                                        // Render the buttons
                                        return pageNumbers.map(number => (
                                            <button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`page-number ${currentPage === number ? 'active' : ''}`}
                                            >
                                                {number}
                                            </button>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}
        </section>
    );
};

export default SearchBar;