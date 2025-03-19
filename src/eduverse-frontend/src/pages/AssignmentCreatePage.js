import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import AssignmentCreate from '../components/Assignment/AssignmentCreate';
import './CoursesCreatePage.css'
const AssignmentCreatePage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <AssignmentCreate />
            <Footer />
        </div>
    )
}

export default AssignmentCreatePage;