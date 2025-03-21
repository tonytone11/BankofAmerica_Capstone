import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  // Form state - updated to match backend field names
  const [formData, setFormData] = useState({
    adultName: '',
    childName: '',
    email: '',
    subject: '',
    message: '',
    created_at: ''
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    adultName: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    message: '',
    isError: false,
    details: '' // For debugging info
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active FAQ state
  const [activeFaq, setActiveFaq] = useState();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {
      adultName: '',
      subject: '',
      message: ''
    };
    let isValid = true;

    // Validate Adult Name
    if (!formData.adultName.trim()) {
      errors.adultName = 'Adult Name is required';
      isValid = false;
    } else if (formData.adultName.trim().length < 2) {
      errors.adultName = 'Adult Name must be at least 2 characters long';
      isValid = false;
    }

    // Validate Subject
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    // Validate Message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
      isValid = false;
    } else if (formData.message.trim().length > 10000) {
      errors.message = 'Message cannot exceed 10,000 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission - enhanced with better error handling and logging
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({
      message: 'Sending your message...',
      isError: false,
      details: ''
    });
    
    console.log('Attempting to submit form data:', formData);
    
    try {
      // Log the full request details for debugging
      console.log('Sending POST request to:', '/contact');
      
      const response = await fetch('http://localhost:3003/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setSubmitStatus({
          message: 'Thank you for your message! We will get back to you soon.',
          isError: false
        });
        
        // Reset form
        setFormData({
          adultName: '',
          childName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          message: data.message || 'Something went wrong. Please try again.',
          isError: true,
          details: `Server reported: ${JSON.stringify(data)}`
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        message: 'Network error. Please check your connection and try again.',
        isError: true,
        details: `Error: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate message character count and limits
  const messageLength = formData.message.length;
  const messageRemaining = 10000 - messageLength;

  return (
    <div>
      <main className="contact-container">
        {/* Page Title */}
        <div className="page-header">
          <h1>Contact Us</h1>
          <p className="page-subtitle">Need help or have questions? We're here to support your football journey.</p>
        </div>
        
        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-content">
              <h2>Send Us a Message</h2>
              <div className='note-background'>
                <p className="page-note-1"><strong>For young players:</strong> Please ask your parent or guardian to help you contact us.</p>
                <p className="page-note-2"><strong>Parents:</strong> Feel free to contact us with any questions.</p>
              </div>
              
              {/* Status message display */}
              {submitStatus.message && (
                <div className={`status-message ${submitStatus.isError ? 'error' : 'success'}`}>
                  <p>{submitStatus.message}</p>
                  {submitStatus.details && process.env.NODE_ENV === 'development' && (
                    <p className="debug-info">{submitStatus.details}</p>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className='full-name-form' htmlFor="adultName">Adult Name *</label>
                  <input
                    type="text"
                    id="adultName"
                    name="adultName"
                    value={formData.adultName}
                    onChange={handleInputChange}
                    className={validationErrors.adultName ? 'input-error' : ''}
                  />
                  {validationErrors.adultName && (
                    <p className="error-text">{validationErrors.adultName}</p>
                  )}
                </div>
                <div className='form-group'>
                  <label htmlFor="childName">Child's Name (if applicable)</label>
                  <input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={validationErrors.subject ? 'input-error' : ''}
                  />
                  {validationErrors.subject && (
                    <p className="error-text">{validationErrors.subject}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className={validationErrors.message ? 'input-error' : ''}
                  ></textarea>
                  {validationErrors.message && (
                    <p className="error-text">{validationErrors.message}</p>
                  )}
                  <p className="character-count">
                    {messageLength} / 10000 characters
                    {messageLength > 0 && messageLength < 10 && (
                      <span className="count-warning"> (minimum 10 characters required)</span>
                    )}
                  </p>
                </div>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
            <div className="form-image">
              <div className="image-placeholder">
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - unchanged */}
      </main>
    </div>
  );
};

export default Contact;