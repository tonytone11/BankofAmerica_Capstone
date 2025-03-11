import React from 'react';
// import SearchBar from '../components/SearchBar';
// import FilterBar from '../components/FilterBar';
// import FeaturedPlayer from '../components/FeaturedPlayer';
// import PlayerCatalog from '../components/PlayerCatalog';
import '../styles/Player.css';

function Player() {
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
                    <div className="search-bar">
                        <div className="search-icon"></div>
                        <input type="text" placeholder="Search for players by name..." />
                    </div>

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

                {/* Featured Player Section */}
                <section className="featured-player">
                    <div className="placeholder">PLAYER PHOTO</div>

                    <div className="player-details">
                        <h2>Jude Bellingham</h2>
                        <div className="player-tag">Real Madrid • England</div>

                        <div className="player-stats">
                            <p>Position: Central Midfielder</p>
                            <p>Age: 21</p>
                            <p>Goals: 24</p>
                            <p>Assists: 12</p>
                            <p>Appearances: 58</p>
                        </div>
                    </div>

                    <div className="player-strengths">
                        <h3>Key Strengths:</h3>
                        <div className="strengths-tags">
                            <span className="strength-tag">Passing</span>
                            <span className="strength-tag">Vision</span>
                            <span className="strength-tag">Finishing</span>
                            <span className="strength-tag">Leadership</span>
                        </div>

                        <button className="bookmark-button">+ Bookmark Player</button>
                    </div>
                </section>

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
                        <span>1</span>
                        <span className="active">2</span>
                        <span>3</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Player;