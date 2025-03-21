
import '../styles/Signup.css'
// import Quotes from './components/Quotes'
import { useState } from "react"
// import Quotes from './components/Quotes.jsx';
import Quotes from '../components/Quotes';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",

    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Store errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bankofamerica-capstone.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      //redirects to login page after sucessful registration
      window.location.href = '/login';
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setErrorMessage(error.message); // Store error as a string
    }
  };

  return (
    <div className='page-container'>
      <div className="login-container">
        <div className='main'>
          <h2 className='signuph2'>Create account</h2>
          <h3 className="signuph3">Join the FutureStars community</h3>
          <div className="green-line"></div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit} className='loginform'>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

            <button className="signupButton" type="submit">Sign Up</button>
            <p className="loginp">Already registered? <a className="loginlinks" href="/login"> <u>Login here</u> </a></p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Signup;
