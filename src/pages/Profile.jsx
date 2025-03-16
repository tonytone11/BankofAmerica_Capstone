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

    // Extracts the active tab from the URL so that routes render correctly
    const getActiveTabFromUrl = () => {
        const pathParts = location.pathname.split('/'); //splits the URl ex ("profile/practice-log")
        return pathParts.length > 2 ? pathParts[2] : 'progress'; // Default to 'progress'
    };

    // State to track the active tab and user profile data
    const [activeTab, setActiveTab] = useState(getActiveTabFromUrl);
    const [userName, setUserName] = useState('John Doe');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');

    // Syncs `activeTab` with the URL whenever the pathname changes
    useEffect(() => {
        setActiveTab(getActiveTabFromUrl());
    }, [location.pathname]);

    // Updates the active tab and navigates to the corresponding URL
    const changeTab = (tabName) => {
        setActiveTab(tabName);
        navigate(`/profile/${tabName}`);
    };

    // Handles profile name editing and updating
    const handleUpdateProfile = () => {
        if (isEditing) {
            if (newName.trim() !== '') {
                setUserName(newName); // Update name if not empty
            }
            setIsEditing(false); // Exit edit mode
        } else {
            setNewName(userName); // Prefill input field with current name
            setIsEditing(true); // Enter edit mode
        }
    };

    // Chart.js data configuration for progress tracking
    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data = {
        labels,
        datasets: [{
            label: 'Weekly Training Hours',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: { beginAtZero: true }
        }
    };

    // Determines which content to render based on `activeTab`
    const renderTabContent = () => {
        switch (activeTab) {
            case 'progress':
                return (
                    <div className="progress-container">
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

                {/* User Profile Section */}
                <div className="user-profile-container">
                    {isEditing ? (
                        <div className="edit-profile">
                            <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="name-input"
                                placeholder="Enter your name"
                            />
                            <button 
                                onClick={handleUpdateProfile}
                                className="update-button"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="profile-info">
                            <h2 className="user-name">{userName}</h2>
                            <button 
                                onClick={handleUpdateProfile}
                                className="update-button"
                            >
                                Update Profile
                            </button>
                        </div>
                    )}
                </div>

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
