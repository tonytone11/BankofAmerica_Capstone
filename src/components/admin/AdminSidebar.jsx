import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
    return (
        <aside className="admin-sidebar">
        <nav>
            <ul>
            <li className={activeSection === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveSection('users')}>
                <span className="icon"><FaUsers /></span> Users
                </button>
            </li>
            <li className={activeSection === 'messages' ? 'active' : ''}>
                <button onClick={() => setActiveSection('messages')}>
                <span className="icon"><IoIosMail /></span> Messages
                </button>
            </li>
            </ul>
        </nav>
        
        <div className="admin-logout">
            <Link to="/login" className="logout-btn">
            <span className="icon"></span> Logout
            </Link>
        </div>
        </aside>
    );
};

export default AdminSidebar;