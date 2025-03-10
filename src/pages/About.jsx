import React from 'react';
import '../styles/About.css';
import AngelImage from '../images/Angel.png'
import CarmaniImage from '../images/carmani.png'
import AnthonyImage from '../images/Anthony.jpeg'
import NateImage from '../images/Nate.png'
import JenniferImage from '../images/Jennifer.png'


const About = () => {
  // Team members data
    const teamMembers = [
        {
            id: 1,
            name: "Angel Duerto",
            role: "Founder & CEO",
            background: "Former Youth Coach",
            image: AngelImage
        },
        {
            id: 2,
            name: "Anthony Montesdeoca",
            role: "Technical Director",
            background: "UEFA Licensed Coach",
            image: AnthonyImage 
        },
        {
        id: 3,
            name: "Carmani Harris-Jackson",
            role: "Lead Developer",
            background: "Football Analytics Expert",
            image: CarmaniImage
        },
        {
            id: 4,
            name: "Nate Sherer",
            role: "Marketing Manager",
            background: "Football Expert",
            image: NateImage
        },
        {
            id: 5,
            name: "Jennifer Guzman",
            role: "Social Media Relations",
            background: "Football Fan",
            image: JenniferImage
        }
    ];

    return (
        <div className="page-container">
        
        <main className="about-container">
            {/* Page Title */}
            <div className="page-header">
                <h1>About FutureStars</h1>
                <p className="page-subtitle">Empowering young football talent through accessible technology and training</p>
            </div>
            
            {/* Hero Image Section */}
            <div className="hero-image">
            {/* <div className="image-placeholder">INSPIRING IMAGE OF YOUTH FOOTBALL</div> */}
            </div>
            
            {/* Mission Section */}
            <section className="info-card">
            <h2>Our Mission</h2>
            <div className="underline"></div>
                <p>
                    FutureStars is dedicated to making quality football training and development accessible to all young players, 
                    regardless of their background or resources. We believe that every child with passion and dedication deserves 
                    the chance to reach their potential in the beautiful game.
                </p>
                <p>
                    Through our platform, we connect aspiring footballers with professional resources, structured training, and 
                    inspirational role models to guide their development journey.
                </p>
            </section>
            
            {/* Vision Section */}
            <section className="info-card vision-section">
            <h2>Our Vision</h2>
            <div className="underline vision-underline"></div>
                <p>
                    We envision a future where talented young players from underserved communities have equal opportunities 
                    to develop their skills and achieve their dreams in football, both as athletes and as well-rounded individuals.
                </p>
                <p>
                    By leveraging technology to bridge the gap between professional training methods and grassroots development, 
                    we aim to nurture the next generation of football stars from all walks of life.
                </p>
            </section>
            
            {/* Team Section */}
            <section className="team-section">
            <h2>Our Team</h2>
            <div className="underline"></div>
            <div className="team-members">
                {teamMembers.map(member => (
                <div key={member.id} className="team-member-card">
                    <div className="member-image">
                    <img src={member.image} alt={member.name} />
                    </div>
                    <h3>{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-background">{member.background}</p>
                </div>
                ))}
            </div>
            </section>
        </main>
        </div>
    );
};

export default About;