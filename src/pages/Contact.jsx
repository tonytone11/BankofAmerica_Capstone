
import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
    // Form state
    const [formData, setFormData] = useState({
        adultName: '',
        childName: '',
        email: '',
        subject: '',
        message: ''
    });

    // Active FAQ state
    const [activeFaq, setActiveFaq] = useState();

    // FAQ data
    const faqItems = [
        {
            question: "How do I track my training progress?",
            answer: "You can track your training progress through your Profile page. Log your training sessions, set goals, and view visual progress charts that show your improvement over time."
        },
        {
            question: "Can I access training videos offline?",
            answer: "No, we are working on creating an offline version of the training videos page, for now you'll have to be online to access videos."
        },
        {
            question: "How do I bookmark my favorite players?",
            answer: "When viewing a player profile, click the bookmark icon in the top right corner. You can access all your bookmarked players from your Profile page under the 'Bookmarked Players' section."
        },
        {
            question: "Is FutureStars available in my country?",
            answer: "FutureStars is available worldwide! Our mission is to support young football talent everywhere, especially in underserved communities."
        }
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // send form to backend
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        // Reset form
        setFormData({
            adultName: '',
            childName: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    // Toggle FAQ item
    const toggleFaq = (index) => {
        if (activeFaq === index) {
            setActiveFaq(null); // Close if already open
        } else {
            setActiveFaq(index); // Open the clicked item
        }
    };

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
                                <p className="page-note-1"> <strong>For young players:</strong> Please ask your parent or guardian to help you contact us. We love hearing from our future stars, but we need to make sure you have adult supervision when reaching out.</p>
                                <p className="page-note-2"><strong>Parents:</strong> Feel free to contact us with any questions about your child's experience or about our organization. We're committed to providing assistance and addressing all your concerns.</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className='full-name-form' htmlFor="adultName">Adult Name</label>
                                    <input
                                        type="text"
                                        id="adultName"
                                        name="adultName"
                                        value={formData.adultName}
                                        onChange={handleInputChange}
                                        required
                                    />
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
                                    <label htmlFor="email">Email Address</label>
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
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn">SEND MESSAGE</button>
                            </form>
                        </div>
                        <div className="form-image">
                            <div className="image-placeholder">
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-items">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="faq-question">
                                    <h3>{item.question}</h3>
                                    <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                                </div>
                                {activeFaq === index && (
                                    <div className="faq-answer">
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Contact;
