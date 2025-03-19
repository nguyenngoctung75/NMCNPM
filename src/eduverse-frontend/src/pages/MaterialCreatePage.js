import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import MaterialCreate from '../components/Material/MaterialCreate';
const MaterialCreatePage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <MaterialCreate />
            <Footer />
        </div>
    )
}

export default MaterialCreatePage;