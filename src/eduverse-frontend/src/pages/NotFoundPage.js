import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import './NotFoundPage.css';
import illustration from '../assets/images/404illustration.jpg'; 

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <Header />
            <div className="not-found-content">
                <h1 className="not-found-heading">404 - Không tìm thấy trang</h1>
                <img src={illustration} alt="404 Illustration" className="not-found-illustration" />
                <p className="not-found-para">Rất tiếc, trang bạn đang tìm không tồn tại. Hãy thử kiểm tra lại URL hoặc quay về trang chủ để tiếp tục khám phá.</p>
                <div className="not-found-buttons">
                    <Link to="/home" className="not-found-button">Quay lại trang chủ</Link>
                    <Link to="/courses" className="not-found-button">Tìm khóa học</Link>
                </div>
                <div className="not-found-quote">
                    <p className="not-found-para">Học là hành trình, đừng bỏ lỡ bất kỳ bài học nào!</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NotFoundPage;