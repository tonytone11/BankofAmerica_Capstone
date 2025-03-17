import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { isAuthenticated } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import {logout} from '../utils/authUtils';
import Star from './StarIcon'


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=> {
    setIsLoggedIn(isAuthenticated());
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
            <li className={isActive('/training')}>
              <Link to="/training" onClick={() => setShowMobileMenu(false)}>Training</Link>
            </li>
            <li className={isActive('/players')}>
              <Link to="/players" onClick={() => setShowMobileMenu(false)}>Players</Link>
            </li>
            <li className={isActive('/about')}>
              <Link to="/about" onClick={() => setShowMobileMenu(false)}>About</Link>
            </li>
            <li className={isActive('/contact')}>
              <Link to="/contact" onClick={() => setShowMobileMenu(false)}>Contact</Link>
            </li>
            {/* Login button for mobile view */}
            <li className="mobile-login-item">
              <Link to={localStorage.getItem('token') ? "#" : "/login"} 
              className="mobile-login-btn" onClick={(e) => {
                if(localStorage.getItem('token')){
                e.preventDefault();
                logout();
              }
                setShowMobileMenu(false);
            }}
            >
              {localStorage.getItem('token') ? 'Logout' : "Login"}
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Desktop Login Button */}
        <Link 
  to={localStorage.getItem('token') ? "#" : "/login"} 
  className="login-btn desktop-only"
  onClick={(e) => {
    if (localStorage.getItem('token')) {
      e.preventDefault(); // Prevent navigation
      logout(); // Call your logout function  
    }
  }}
>
  {localStorage.getItem('token') ? 'Logout' : 'Login'}
</Link>
      </div>
    </nav>
  );
};

export default Navbar;