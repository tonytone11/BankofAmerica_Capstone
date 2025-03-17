import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Profile.css';
import Practicelog from '../components/Practicelog';
import Goals from '../components/Goals';
import ProgressChart from '../components/ProgressChart'; // Import the new component

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract tab from the URL path (default to 'progress')
    const getActiveTabFromUrl = () => {
        const pathParts = location.pathname.split('/');
        return pathParts.length > 2 ? pathParts[2] : 'progress';
    };

    const [activeTab, setActiveTab] = useState(getActiveTabFromUrl);

    // Sync state with URL when component mounts
    useEffect(() => {
        setActiveTab(getActiveTabFromUrl());
    }, [location.pathname]);

    // Function to handle tab change & update URL
    const changeTab = (tabName) => {
        setActiveTab(tabName);
        navigate(`/profile/${tabName}`); // Update URL without reloading
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'progress':
                return (
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <h2>My Progress</h2>
                        <ProgressChart />
                    </div>
                );
            case 'practice-log':
                return <Practicelog />;
            case 'goals':
                return <Goals />;
            case 'roleModels':
                return (
                    <div>
                        <h2>Role Models</h2>
                        <p>Your role models will appear here.</p>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="page-container">
            <main className="profile-container">
                <h1 className="profile_title_hero">MY PROFILE</h1>

                {/* Navigation Tabs */}
                <div className="profile-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
                        onClick={() => changeTab('progress')}
                    >
                        Progress
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'practice-log' ? 'active' : ''}`}
                        onClick={() => changeTab('practice-log')}
                    >
                        Practice Log
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
                        onClick={() => changeTab('goals')}
                    >
                        Goals
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'roleModels' ? 'active' : ''}`}
                        onClick={() => changeTab('roleModels')}
                    >
                        Role Models
                    </button>
                </div>

                {/* Tab Content */}
                <section className="tab-content">
                    {renderTabContent()}
                </section>
            </main>
        </div>
    );
}








