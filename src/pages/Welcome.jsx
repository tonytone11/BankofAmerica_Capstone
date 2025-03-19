import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

const Welcome= () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT token

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode JWT
        setUserName(decoded.firstName); // Extract first name
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, []);

  return (
    <div className='page-container'>
    <div className="home-container">
      <div className='main'>
    <div className="welcome-page">
      <div className="left">
        <h1>
          <div className="welcomeMessage">Welcome, ${user.firstName}!</div>
        </h1>
        <p>Your journey of support and connection begins here. Together, we make a difference.</p>

        <button className="goToProfile">
          <Link to="/registration/profile">Go to Profile</Link>
        </button>

        <button className="goToProfile">
          <Link to="/">Go to Home</Link>
        </button>
      </div>

      <div className="right">
        {/* Background image can be handled in CSS */}
      </div>
    </div>
    </div>
    </div>
    </div>
  
  );
};

export default Welcome;
