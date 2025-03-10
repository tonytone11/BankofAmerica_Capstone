import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h2>{title} Page</h2>
        <p>This page is coming soon!</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="/training" element={<PlaceholderPage title="Training" />} />
        <Route path="/players" element={<PlaceholderPage title="Players" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
        <Route path="/login" element={<PlaceholderPage title="Login" />} />
        <Route path="/signup" element={<PlaceholderPage title="Sign Up" />} />
        <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
