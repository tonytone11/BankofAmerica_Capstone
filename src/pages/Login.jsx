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
      const response = await fetch("http://localhost:3003/api/auth/login", {
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

      if(data.token){
        localStorage.setItem('token', data.token);
        console.log("Token stored:");
      } else{
        console.warn("No token received from server");
      }

      alert(`Login successful! Welcome, ${data.message}`);
      window.location.href= '/profile';
      setErrorMessage("");
    } catch (error){
      setErrorMessage(error.message);
    }
  };

      // localStorage.setItem('user', JSON.stringify({
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      //   email: data.email
      // }));

  //     alert(`Login successful! Welcome, ${data.message}`);
  //     window.location.href = '/profile';
  //     setErrorMessage(""); // Clear previous errors
  //   } catch (error) {
  //     setErrorMessage(error.message); // Store error as a string
  //   }
  // };

  return (
    
    <div className="login-page-container">

    <div className="login-container">
        <div className="main">
      <h2 className="loginh2">Login</h2>
      <div className="green-line"></div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        <p>Dont have an account? <a href="/signup">sign up here</a></p>
      </form>
      </div>
    </div>
    </div>


  );
};

export default Login;
