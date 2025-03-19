import React from 'react';
import './AdminHeader.css';
import { getCurrentUser } from '../../utils/authUtils';

const AdminHeader = () => {
    // Get current user information
    const user = getCurrentUser();
    
    // Default name display if user information is not available
    const displayName = user ? user.firstName : 'Admin';
    
    // Initial for avatar
    const avatarInitial = user && user.firstName ? user.firstName.charAt(0) : 'A';
    
    return (
        <header className="admin-header">
            <div className="logo">
                <span className="admin-badge">Admin</span>
            </div>
            <div className="admin-profile">
                <div className="notifications">
                </div>
                <div className="profile">
                    <div className="avatar">{avatarInitial}</div>
                    <span>{displayName}</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;