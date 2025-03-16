import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Practicelog from '../components/Practicelog';
import Goals from '../components/Goals';
import { getAuthHeader } from '../utils/authUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Profile() {
    const [activeTab, setActiveTab] = useState('progress');
    const [userName, setUserName] = useState('John Doe');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile data when component mounts
    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch("http://localhost:3000/api/user/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setUserData(data);
                setUserName(data.name || 'John Doe');
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (isEditing) {
            if (newName.trim() !== '') {
                try {
                    const response = await fetch("http://localhost:3000/api/user/update-profile", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getAuthHeader()
                        },
                        body: JSON.stringify({ name: newName })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update profile');
                    }

                    setUserName(newName);
                    // You could also refetch the user data here if needed
                } catch (err) {
                    setError(err.message);
                }
            }
            setIsEditing(false);
        } else {
            setNewName(userName);
            setIsEditing(true);
        }
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
            case 'practiceLog':
                return <Practicelog />;
            case 'goals':
                return <Goals />;
            case 'roleModels':
                return (
                    <div>
                        <h2>Role Models</h2>
                        <p>Your role models will appear here.</p>
                        {/* Add role models components here */}
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="page-container">
            <main className="profile-container">
                <h1 className="profile_title_hero">MY PROFILE</h1>
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
                        onClick={() => setActiveTab('progress')}
                    >
                        Progress
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'practiceLog' ? 'active' : ''}`}
                        onClick={() => setActiveTab('practiceLog')}
                    >
                        Practice Log
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('goals')}
                    >
                        Goals
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'roleModels' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roleModels')}
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