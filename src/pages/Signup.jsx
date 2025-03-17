
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
      const response = await fetch("http://localhost:3003/api/auth/signup", {
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
    <div className="home-container">
        <div className='main'>
      <h2>Signup</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
       
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        
        <button type="submit">Sign Up</button>
      </form>
      <Quotes/>
      </div>
    </div>
    </div>
  );
};

export default Signup;
