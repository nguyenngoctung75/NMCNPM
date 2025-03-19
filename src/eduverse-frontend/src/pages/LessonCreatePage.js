import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import LessonCreate from '../components/Lesson/LessonCreate';
const LessonCreatePage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <LessonCreate />
            <Footer />
        </div>
    )
}

export default LessonCreatePage;