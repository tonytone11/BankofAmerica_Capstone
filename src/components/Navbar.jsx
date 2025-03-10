import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
          <div className="soccer-ball-icon"></div>
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
              <Link to="/login" className="mobile-login-btn" onClick={() => setShowMobileMenu(false)}>
                Login
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Desktop Login Button */}
        <Link to="/login" className="login-btn desktop-only">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;