// Trang thông báo chức năng đang cập nhật

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import './MaintenancePage.css';
import maintenanceIllustration from '../assets/images/Maintenance-illustration.svg'; // Hình ảnh minh họa

const MaintenancePage = () => {
    return (
        <div className="maintenance-page">
            <Header />
            <div className="maintenance-content">
                <h1 className="maintenance-head1">Thông báo Bảo trì</h1>
                <img src={maintenanceIllustration} alt="Maintenance Illustration" className="maintenance-illustration" />
                <p className="maintenance-para">Hiện tại, chức năng này đang được bảo trì/phát triển và sẽ sớm trở lại. Cảm ơn sự kiên nhẫn của bạn!</p>
                <div className="maintenance-details">
                    <h2 className="maintenance-head2">Danh sách các chức năng:</h2>
                    <ul>
                        <li>🔧 Đang bảo trì:
                            <ul>
                                <li>Chức năng A - Hoàn thành vào ngày 12/12/2024</li>
                                <li>Chức năng B - Hoàn thành vào ngày 14/12/2024</li>
                            </ul>
                        </li>
                        <li>⚙️ Đang phát triển:
                            <ul>
                                <li>Chức năng C - Dự kiến ra mắt vào tháng 1/2025</li>
                                <li>Chức năng D - Dự kiến ra mắt vào tháng 2/2025</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="maintenance-buttons">
                    <Link to="/home" className="maintenance-button">Quay lại trang chủ</Link>
                    <Link to="/contact" className="maintenance-button">Liên hệ hỗ trợ</Link>
                </div>
                <div className="maintenance-contact-info">
                    <p className="maintenance-para">Nếu bạn cần hỗ trợ khẩn cấp, vui lòng liên hệ với chúng tôi qua email: support@example.com hoặc số điện thoại: 123-456-7890.</p>
                </div>
                <div className="maintenance-quote">
                    <p className="maintenance-para">Học là hành trình, đừng bỏ lỡ bất kỳ bài học nào!</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MaintenancePage;
