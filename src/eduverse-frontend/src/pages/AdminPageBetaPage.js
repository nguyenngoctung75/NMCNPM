import React from 'react';
import Header from '../components/Common/Header';
import HeroSection from '../components/Home/HeroSection';
import Footer from '../components/Common/Footer';
import Admin from '../components/Admin/admin';
const AdminPage = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <Admin />
            <Footer />
        </div>
    )
}

export default AdminPage;