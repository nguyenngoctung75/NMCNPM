import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import MaterialShow from '../components/Material/MaterialShow';
const MaterialShowPage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <MaterialShow />
            <Footer />
        </div>
    )
}

export default MaterialShowPage;