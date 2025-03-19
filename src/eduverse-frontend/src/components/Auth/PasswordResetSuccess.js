import React from 'react';
import { Link } from 'react-router-dom';
import './PasswordResetSuccess.css';

const PasswordResetSuccessPage = () => {
    return (
        <div className="password-reset-success-page">
            <div className="password-reset-success-box">
                <h2 className="password-reset-success-heading">Đổi Mật Khẩu Thành Công</h2>
                <p className="password-reset-success-para">Mật khẩu của bạn đã được đặt lại thành công. <br /> Bạn có thể đăng nhập với mật khẩu mới.</p>
                <div className="password-reset-success-links">
                    <p className="password-reset-success-para"><Link to="/login">Quay lại đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetSuccessPage;