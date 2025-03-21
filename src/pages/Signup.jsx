import '../styles/Signup.css'
import { useState } from "react"
import Quotes from '../components/Quotes';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Store server errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: ""
    };
    let isValid = true;

    // Validate First Name (similar to contact form name validation)
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    // Validate Last Name
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    // Validate Username
    if (!formData.userName.trim()) {
      errors.userName = "Username is required";
      isValid = false;
    } else if (formData.userName.trim().length < 3) {
      errors.userName = "Username must be at least 3 characters";
      isValid = false;
    }

    // Validate Email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate Password
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = "Password must include at least one lowercase letter";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = "Password must include at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must include at least one number";
      isValid = false;
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = "Password must include at least one special character (@$!%*?&)";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
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

      //redirects to login page after successful registration
      window.location.href = '/login';
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setErrorMessage(error.message); // Store error as a string
    }
  };

  return (
    <div className='login-page-container'>
      <div className="login-container">
        <div className='main'>
          <h2 className='signuph2'>Create account</h2>
          <h3 className="signuph3">Join the FutureStars community</h3>
          <div className="green-line"></div>
          {errorMessage && <p className="server-error">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className='loginform'>
            <div className="form-field">
              <input 
                type="text" 
                name="firstName" 
                placeholder="First Name" 
                onChange={handleChange} 
                className={validationErrors.firstName ? "input-error" : ""}
              />
              {validationErrors.firstName && (
                <p className="error-text">{validationErrors.firstName}</p>
              )}
            </div>
            
            <div className="form-field">
              <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name" 
                onChange={handleChange} 
                className={validationErrors.lastName ? "input-error" : ""}
              />
              {validationErrors.lastName && (
                <p className="error-text">{validationErrors.lastName}</p>
              )}
            </div>
            
            <div className="form-field">
              <input 
                type="text" 
                name="userName" 
                placeholder="Username" 
                onChange={handleChange} 
                className={validationErrors.userName ? "input-error" : ""}
              />
              {validationErrors.userName && (
                <p className="error-text">{validationErrors.userName}</p>
              )}
            </div>
            
            <div className="form-field">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                onChange={handleChange} 
                className={validationErrors.email ? "input-error" : ""}
              />
              {validationErrors.email && (
                <p className="error-text">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="form-field">
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                className={validationErrors.password ? "input-error" : ""}
              />
              {validationErrors.password && (
                <p className="error-text">{validationErrors.password}</p>
              )}
              <p className="password-requirements">
                Password must be at least 8 characters and include uppercase, lowercase, 
                number, and special character
              </p>
            </div>
            
            <button className="signupButton" type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;