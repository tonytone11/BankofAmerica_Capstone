import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Quotes from '../components/Quotes';
import News from '../components/FootballNews';
import { isAuthenticated } from '../utils/authUtils';

const Home = () => {
    const navigate = useNavigate();
    const userLoggedIn = isAuthenticated();
    
    // Handler for protected links
    const handleProtectedLink = (e, path) => {
        if (!userLoggedIn) {
            e.preventDefault();
            navigate('/login');
        } else {
            navigate(path);
        }
    };

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
                        <Link to={userLoggedIn ? "/profile" : "/signup"} className="primary-btn">
                            {userLoggedIn ? "MY PROFILE" : "GET STARTED"}
                        </Link>
                    </div>
                </div>
            </section>
               {/* Quick Access Feature Cards with hover descriptions */}
               <section className="feature-cards">
                <div 
                    className="feature track-progress"
                    onClick={(e) => handleProtectedLink(e, '/profile')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="feature-content">
                        <h3>TRACK PROGRESS</h3>
                        <p className="feature-description">Record your training stats, track improvements, and set goals for your football journey.</p>
                    </div>
                </div>
                
                <div 
                    className="feature watch-training"
                    onClick={(e) => handleProtectedLink(e, '/training')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="feature-content">
                        <h3>WATCH TRAINING</h3>
                        <p className="feature-description">Access professional training videos, drills, and techniques to improve your skills.</p>
                    </div>
                </div>
                
                <div 
                    className="feature explore-players"
                    onClick={(e) => handleProtectedLink(e, '/players')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="feature-content">
                        <h3>EXPLORE PLAYERS</h3>
                        <p className="feature-description">Discover players, view their stats, and find potential role models.</p>
                    </div>
                </div>
            </section>

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
                <h4 className='quote-subtitle'>Football player quote of the day:</h4>
                <Quotes />
            </div>

            {/* News Feed Card */}
                <News />
            </section>
            </main>
        </div>
    );
};

export default Home;