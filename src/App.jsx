import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Player from './pages/Player';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Training from './pages/Training';
import Practicelog  from './components/Practicelog';
import Goals from './components/Goals';
import Welcome from './pages/Welcome';
import Admin from './pages/Admin'
import './App.css';
import PracticeLog from './components/Practicelog';
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
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/training" element={<Training />} />
        <Route path="/players" element={<Player />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;