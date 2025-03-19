import React, { useState } from 'react';
import SearchBar from '../components/SearchBar'; // Adjust import paths as needed
import FeaturedPlayer from '../components/FeaturedPlayer'; // Adjust import paths as needed`
import PlayerCatalog from '../components/PlayerCatalog';
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
                <section className="player-page-title">
                    <h1>Players</h1>
                    <p>Get inspired by your favorite players</p>
                </section>

                {/* Search and Filter Bar */}
                <section className="player-search-filter">
                    {/* Pass the handler to SearchBar */}
                    <SearchBar onSelectPlayer={handlePlayerSelect} />

                    <div className="player-filters">
                        <div className="player-filter-dropdown">
                            <span>Position</span>
                            <div className="dropdown-arrow"></div>
                        </div>
                    </div>
                </section>

                {/* Featured Player Section - Pass selected player */}
                <FeaturedPlayer selectedPlayer={selectedPlayer} />

                {/* Popular Player Section */}
                <section className="player-catalog">
                    <h2>Popular Player</h2>
                    <div className='player-grid'>
                        <PlayerCatalog playerId="278" onSelectPlayer={handlePlayerSelect} />
                        <PlayerCatalog playerId="1100" onSelectPlayer={handlePlayerSelect} />
                        <PlayerCatalog playerId="762" onSelectPlayer={handlePlayerSelect} />
                        <PlayerCatalog playerId="129718" onSelectPlayer={handlePlayerSelect} />
                        <PlayerCatalog playerId="306" onSelectPlayer={handlePlayerSelect} />
                        <PlayerCatalog playerId="386828" onSelectPlayer={handlePlayerSelect} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Player;