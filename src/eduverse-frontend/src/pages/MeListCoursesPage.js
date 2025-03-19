import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import MeListCourse from '../components/Course/MeListCourses';
const MeListCoursesPage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <MeListCourse />
            <Footer />
        </div>
    )
}

export default MeListCoursesPage;