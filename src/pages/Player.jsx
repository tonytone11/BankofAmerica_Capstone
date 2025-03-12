import React, { useState } from 'react';
import SearchBar from '../components/SearchBar'; // Adjust import paths as needed
import FeaturedPlayer from '../components/FeaturedPlayer'; // Adjust import paths as needed`
import '../styles/Player.css';

function Player() {
    // Add state to store the selected player
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Function to handle player selection from SearchBar
    const handlePlayerSelect = (player) => {
        console.log('Player.jsx received player:', player);
        setSelectedPlayer(player);
    };

    return (
        <div className="player-container">
            <main>
                {/* Page Title */}
                <section className="page-title">
                    <h1>Players</h1>
                    <p>Find and learn from professional players who inspire you</p>
                </section>

                {/* Search and Filter Bar */}
                <section className="search-filter">
                    {/* Pass the handler to SearchBar */}
                    <SearchBar onSelectPlayer={handlePlayerSelect} />
                    <div className="filters">
                        <div className="filter-dropdown">
                            <span>Position</span>
                            <div className="dropdown-arrow"></div>
                        </div>

                        <div className="filter-dropdown">
                            <span>Team</span>
                            <div className="dropdown-arrow"></div>
                        </div>

                        <div className="filter-dropdown">
                            <span>Country</span>
                            <div className="dropdown-arrow"></div>
                        </div>
                    </div>
                </section>

                {/* Featured Player Section - Pass selected player */}
                <FeaturedPlayer selectedPlayer={selectedPlayer} />

                {/* Player Catalog Section */}
                <section className="player-catalog">
                    <h2>Player Catalog</h2>

                    <div className="category-tabs">
                        <button className="tab active">Popular</button>
                        <button className="tab">Attackers</button>
                        <button className="tab">Midfielders</button>
                        <button className="tab">Defenders</button>
                        <button className="tab">Goalkeepers</button>
                        <button className="tab">Rising Stars</button>
                    </div>

                    <div className="player-grid">
                        {/* Row 1 */}
                        <div className="player-card">
                            <div className="player-avatar"></div>
                            <h3>Kylian Mbappé</h3>
                            <p>Forward • Real Madrid</p>
                        </div>

                        <div className="player-card">
                            <div className="player-avatar"></div>
                            <h3>Erling Haaland</h3>
                            <p>Forward • Man City</p>
                        </div>

                        <div className="player-card">
                            <div className="player-avatar"></div>
                            <h3>Vini Jr.</h3>
                            <p>Forward • Real Madrid</p>
                        </div>

                        {/* Row 2 */}
                        <div className="player-card">
                            <div className="player-avatar"></div>
                            <h3>Kevin De Bruyne</h3>
                            <p>Midfielder • Man City</p>
                        </div>

                        <div className="player-card">
                            <div className="player-avatar"></div>
                            <h3>Rodri</h3>
                            <p>Midfielder • Man City</p>
                        </div>

                        <div className="player-card">
                            <div className="player-avatar"></div>
                            <h3>Lamine Yamal</h3>
                            <p>Forward • Barcelona</p>
                        </div>
                    </div>

                    <div className="pagination">
                        <span className="active">1</span>
                        <span>2</span>
                        <span>3</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Player;