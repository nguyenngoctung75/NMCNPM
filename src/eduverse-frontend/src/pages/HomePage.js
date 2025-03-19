import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import MainContent from '../components/Home/MainContent';
import Footer from '../components/Common/Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <HeroSection />
      <MainContent />
      <Footer />
    </div>
  );
};

export default HomePage;
