import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import LessonShow from '../components/Lesson/LessonShow';
const LessonShowPage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <LessonShow />
            <Footer />
        </div>
    )
}

export default LessonShowPage;