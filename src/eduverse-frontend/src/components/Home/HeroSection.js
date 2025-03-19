import React, { useContext } from 'react';
import './HeroSection.css';
import coverImage from '../../assets/images/Home-Section.jpg';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext';
 
const HeroSection = () => {
    const { isLoggedIn } = useContext(AuthContext);
    return (
        <div className="hero-section">
            <img src={coverImage} alt="EduVerse Cover" className="hero-image" />
            <div className="hero-content">
                <h1>Welcome to EduVerse</h1>
                <p>Explore a world of learning and enhance your skills with our diverse range of courses.</p>
                {!isLoggedIn ? (
                    <Link to="/register" className="cta-button">Get Started</Link>
                ) : (
                    <Link to="/course/list" className="cta-button"> Khám phá </Link>
                ) }
               
            </div>
        </div>
       
    );
};
 
export default HeroSection;