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
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      alert(`Login successful! Welcome, ${data.message}`);
      window.location.href = '/welcome';
      setErrorMessage(""); // Clear previous errors
    } catch (error) {
      setErrorMessage(error.message); // Store error as a string
    }
  };

  return (
    
    <div className="page-container">

    <div className="home-container">
        <div className="main">
      <h2 className="loginh2">Login</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="loginform">
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="signupButton" type="submit">Login</button>
        <p className="loginp">Dont have an account? <a className="loginlinks" href="/signup">sign up here</a></p>
      </form>
      </div>
    </div>
    </div>


  );
};

export default Login;