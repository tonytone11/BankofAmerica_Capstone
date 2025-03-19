import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
    return (
        <header className="admin-header">
        <div className="logo">
            <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-profile">
            <div className="notifications">
            </div>
            <div className="profile">
            <div className="avatar">A</div>
                <span>Cherub</span>
            </div>
        </div>
        </header>
    );
};

export default AdminHeader;