import { useState } from "react";
import '../styles/Login.css'
// import '../styles/Home.css'
const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Store errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request with:", formData);

      const response = await fetch("https://bankofamerica-capstone.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        localStorage.setItem('token', data.token);

        // Store user information, including admin status
        const userData = {
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          username: data.user.username,
          email: data.user.email,
          isAdmin: data.user.isAdmin // Store the admin status
        };

        console.log("Storing user data:", userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Check what's stored in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log("Retrieved user from localStorage:", storedUser);
        console.log("Admin status in localStorage:", storedUser.isAdmin);
      } else {
        console.warn("No token received from server");
      }



      // Debug admin status before redirection
      console.log("Is admin?", data.user.isAdmin);

      // Redirect based on admin status
      if (data.user.isAdmin) {
        console.log("Redirecting to admin page");
        window.location.href = '/admin'; // Redirect admins to admin page
      } else {
        console.log("Redirecting to profile page");
        window.location.href = '/profile'; // Redirect regular users to profile
      }

      setErrorMessage("");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    }
  };

  return (

    <div className="page-container">

      <div className="login-container">
        <div className="main">
          <h2 className="loginh2">Login</h2>
          <div className="green-line"></div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="loginform">
            <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button className="signupButton" type="submit">Login</button>
            <p className="loginp">Dont have an account? <a className="loginlinks" href="/signup"> <u>sign up here</u> </a></p>
          </form>
        </div>
      </div>
    </div>


  );
};

export default Login;