import React, { useState } from "react";
import "../styles/Contact.css"; // Import the CSS file

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate form inputs
    const validate = () => {
        let tempErrors = {};

        if (!formData.name.trim()) tempErrors.name = "Name is required.";
        if (!formData.email.trim()) {
            tempErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Enter a valid email.";
        }
        if (!formData.message.trim()) {
            tempErrors.message = "Message cannot be empty.";
        } else if (formData.message.length < 10) {
            tempErrors.message = "Message must be at least 10 characters.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            alert("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
            setErrors({});
        }
    };

    return (
        <div className="page-container">
        <div className="home-container">
        <div className="contact-container">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="input-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "error-input" : ""}
                        placeholder="Enter your name"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "error-input" : ""}
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                    <label>Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={errors.message ? "error-input" : ""}
                        placeholder="Enter your message"
                    />
                    {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
            </form>
        </div>
        </div>

        </div>
    );
};

export default ContactForm;
