import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Practicelog from './components/Practicelog';
import Goals from './components/Goals';
import Welcome from './pages/Welcome';
import Admin from './pages/Admin';
import './App.css';
import { isAuthenticated, isAdmin } from './utils/authUtils';

// Protected route for authenticated users
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Protected route for admin users
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin()) {
    return <Navigate to="/profile" />;
  }
  return children;
};

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

const Error = () => (
  <div className="error-page">
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Protected routes */}
        <Route path="/profile/*" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/training" element={
          <ProtectedRoute>
            <Training />
          </ProtectedRoute>
        } />
        <Route path="/players" element={
          <ProtectedRoute>
            <Player />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />
        
        {/* Error page */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;