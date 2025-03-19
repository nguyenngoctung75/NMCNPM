import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import CourseCreate from '../components/Course/CourseCreate';
import './CoursesCreatePage.css'
const CoursesCreatePage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <CourseCreate />
            <Footer />
        </div>
    )
}

export default CoursesCreatePage;