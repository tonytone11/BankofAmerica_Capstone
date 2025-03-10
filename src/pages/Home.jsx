import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';


const Home = () => {
    return (
        <div className="page-container">
            <main className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>DEVELOP YOUR TALENT</h1>
                    <h2>Track your progress. Learn from the pros.</h2>
                    <h2>Achieve your football dreams.</h2>
                    <div className="cta-buttons">
                        <Link to="/signup" className="primary-btn">GET STARTED</Link>
                    </div>
                </div>
            </section>

            {/* Stats Counter */}
            {/* <section className="stats-section">
            <div className="stat-card">
                <h3>10,000+</h3>
                <p>Young Players</p>
            </div>
            <div className="stat-card">
                <h3>500+</h3>
                <p>Training Videos</p>
            </div>
            <div className="stat-card">
                <h3>50+</h3>
                <p>Pro Profiles</p>
            </div>
            </section> */}

            {/* Mission Statement */}
            <section className="mission-section">
            <h2>OUR MISSION</h2>
                <p>
                    Empowering young football talents worldwide with accessible training
                    resources, progress tracking tools, and professional inspiration.
                </p>
            </section>

            {/* Content Cards Section */}
            <section className="content-cards">
            {/* Daily Inspiration Card */}
            <div className="card inspiration-card">
                <div className="card-header">DAILY INSPIRATION</div>
                <div className="card-content">
                <div className="player-image">
                    {/* <img src={playerImageUrl} alt="Player" /> */}
                </div>
                <div className="player-info">
                        <h3>Lionel Messi</h3>
                        <p className="player-team">Argentina</p>
                        <p className="player-quote">"Hard work beats talent when talent doesn't work hard."</p>
                        <p className="player-story">
                        From academy player to Manchester United star and community leader
                        </p>
                </div>
                </div>
            </div>

            {/* News Feed Card */}
            <div className="card news-card">
                <div className="card-header">FOOTBALL NEWS</div>
                <div className="card-content">
                <div className="news-item">
                    <h4>UEFA launches new youth development program</h4>
                    <p className="news-meta">2 hours ago • UEFA.com</p>
                </div>
                <div className="news-item">
                    <h4>Top academy graduates making an impact this season</h4>
                    <p className="news-meta">Yesterday • FutureStars Blog</p>
                </div>
                </div>
            </div>
            </section>

            {/* Quick Access Feature Cards */}
            <section className="feature-cards">
                <Link to="/profile" className="feature track-progress">
                    <h3>TRACK PROGRESS</h3>
                </Link>
                <Link to="/training" className="feature watch-training">
                    <h3>WATCH TRAINING</h3>
                </Link>
                <Link to="/players" className="feature explore-players">
                    <h3>EXPLORE PLAYERS</h3>
                </Link>
            </section>
            </main>
        </div>
    );
};

export default Home;