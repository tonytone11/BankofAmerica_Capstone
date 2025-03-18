import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUsers } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();
    // Hook to access current location information
    const location = useLocation();
    
    /**
     * Extracts the active section from the URL path
     * Returns 'users' as default if no section is specified (just /admin)
     */
    const getActiveSectionFromUrl = () => {
        const pathParts = location.pathname.split('/');
        
        // If path is exactly "/admin" (no subsection), default to "users"
        if (pathParts.length <= 2 || pathParts[2] === '') {
            return 'users';
        }
        
        return pathParts[2];
    };
    
    // Initialize with users as default section
    const [selectedSection, setSelectedSection] = useState('users');
    
    /**
     * Effect to synchronize component state with URL
     * Runs on component mount and whenever URL changes
     * Also handles redirecting /admin to /admin/users
     */
    useEffect(() => {
        // Get the current section from URL
        const currentSection = getActiveSectionFromUrl();
        
        // Set the selected section in local state
        setSelectedSection(currentSection);
        
        // Set the active section in parent component
        setActiveSection(currentSection);
        
        // If we're at exactly /admin, redirect to /admin/users
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
            navigate('/admin/users', { replace: true });
        }
    }, [location.pathname, setActiveSection, navigate]);
    
    // Immediately set active section on first render
    useEffect(() => {
        setActiveSection('users');
    }, []);

    /**
     * Combined handler for section changes:
     * 1. Updates local state
     * 2. Updates parent component state
     * 3. Updates URL to reflect the new section
     */
    const changeSection = (sectionName) => {
        setSelectedSection(sectionName);
        setActiveSection(sectionName);
        navigate(`/admin/${sectionName}`);
    };
    
    return (
        <aside className="admin-sidebar">
            <nav>
                <ul>
                    {/* Users section navigation item */}
                    <li className={activeSection === 'users' ? 'active' : ''}>
                        <button onClick={() => changeSection('users')}>
                            <span className="icon"><FaUsers /></span> Users
                        </button>
                    </li>
                    {/* Messages section navigation item */}
                    <li className={activeSection === 'messages' ? 'active' : ''}>
                        <button onClick={() => changeSection('messages')}>
                            <span className="icon"><IoIosMail /></span> Messages
                        </button>
                    </li>
                </ul>
            </nav>
            
            {/* Logout link - redirects to login page */}
            <div className="admin-logout">
                <Link to="/login" className="logout-btn">
                    <span className="icon"></span> Logout
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;






