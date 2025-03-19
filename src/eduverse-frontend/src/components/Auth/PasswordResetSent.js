import React from 'react';
import { Link } from 'react-router-dom';
import './PasswordResetSent.css';

const PasswordResetSentPage = () => {
    return (
        <div className="password-reset-sent-page">
            <div className="password-reset-sent-box">
                <h2 className="password-reset-sent-heading">Liên Kết Đã Gửi</h2>
                <p className="password-reset-sent-para">Đã gửi liên kết đặt lại mật khẩu đến email của bạn. <br />  Vui lòng kiểm tra hộp thư.</p>
                <div className="password-reset-sent-links">
                    <p className="password-reset-sent-para"><Link to="/login">Quay lại đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetSentPage;