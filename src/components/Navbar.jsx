import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { isAuthenticated, isAdmin } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/authUtils';
import Star from './StarIcon';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setUserIsAdmin(isAdmin());
  }, [location]);

  // Check if the path matches to set active class
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/" className="logo">FutureStars</Link>
          <Star />
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Navigation */}
        <div className={`nav-menu ${showMobileMenu ? 'mobile-visible' : ''}`}>
          <ul className="nav-links">
            <li className={isActive('/')}>
              <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
            </li>

            {/* Authenticated-only links */}
            {isLoggedIn && (
              <>
                <li className={isActive('/profile')}>
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)}>Profile</Link>
                </li>
                <li className={isActive('/training')}>
                  <Link to="/training" onClick={() => setShowMobileMenu(false)}>Training</Link>
                </li>
                <li className={isActive('/players')}>
                  <Link to="/players" onClick={() => setShowMobileMenu(false)}>Players</Link>
                </li>
              </>
            )}

            {/* Admin-only link */}
            {userIsAdmin && (
              <li className={isActive('/admin')}>
                <Link to="/admin" onClick={() => setShowMobileMenu(false)}>Admin</Link>
              </li>
            )}

            {/* Public links */}
            <li className={isActive('/about')}>
              <Link to="/about" onClick={() => setShowMobileMenu(false)}>About</Link>
            </li>
            <li className={isActive('/contact')}>
              <Link to="/contact" onClick={() => setShowMobileMenu(false)}>Contact</Link>
            </li>
            
            {/* Login button for mobile view */}
            <li className="mobile-login-item">
              <Link 
                to={isLoggedIn ? "#" : "/login"} 
                className="mobile-login-btn" 
                onClick={(e) => {
                  if(isLoggedIn){
                    e.preventDefault();
                    logout();
                  }
                  setShowMobileMenu(false);
                }}
              >
                {isLoggedIn ? 'Logout' : "Login"}
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Desktop Login Button */}
        <Link 
          to={isLoggedIn ? "#" : "/login"} 
          className="login-btn desktop-only"
          onClick={(e) => {
            if (isLoggedIn) {
              e.preventDefault(); // Prevent navigation
              logout(); // Call your logout function  
            }
          }}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;