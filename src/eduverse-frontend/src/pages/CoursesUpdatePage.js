import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import CourseUpdate from '../components/Course/CourseUpdate';
import './CoursesCreatePage.css'
const CoursesUpdatePage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <CourseUpdate />
            <Footer />
        </div>
    )
}

export default CoursesUpdatePage;