import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import CourseList from '../components/Course/CourseList';
import './CoursesListPage.css'
const CoursesListPage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <CourseList />
            <Footer />
        </div>
    )
}

export default CoursesListPage;