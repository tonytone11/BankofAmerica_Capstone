import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Profile.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Practicelog from '../components/Practicelog';
import Goals from '../components/Goals';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Weekly Training Hours',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'progress':
                return (
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <h2>My Progress</h2>
                        <Bar data={data} options={options} />
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
