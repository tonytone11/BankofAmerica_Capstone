import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-heading">FutureStars</h3>
            <p className="footer-description">
              Empowering young football talents with accessible training resources,
              progress tracking tools, and professional inspiration.
            </p>
            <div className="social-icons">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaTwitter size={'20px'}/>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaFacebook size={'20px'}/>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaInstagram size={'20px'}/>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaYoutube size={'20px'}/>
                </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/training">Training</Link></li>
              <li><Link to="/players">Players</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>



          <div className="footer-column">
      <h3 className="footer-heading">Contact Us</h3>
      <ul className="contact-list">
        <li>
          <FaMapMarkerAlt size={20} color='white'/>
          <span>123 Football Street, Sports City</span>
        </li>
        <li>
          <FaPhone size={20} color='white'/>
          <span>+1 234 567 8900</span>
        </li>
        <li>
          <FaEnvelope size={20} color='white'/>
          <span>info@futurestars.com</span>
        </li>
      </ul>
    </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} FutureStars. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;