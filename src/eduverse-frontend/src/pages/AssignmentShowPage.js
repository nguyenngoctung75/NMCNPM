import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import AssignmentShow from '../components/Assignment/AssignmentShow';
const AssignmentShowPage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <AssignmentShow />
            <Footer />
        </div>
    )
}

export default AssignmentShowPage;