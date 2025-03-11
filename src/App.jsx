import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Player from './pages/Player';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Training from './pages/Training';
import ContactForm from './pages/Contact';
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
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/training" element={<Training />} />
        <Route path="/player" element={<Player />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
