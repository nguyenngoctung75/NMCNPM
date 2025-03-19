import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaExclamationCircle } from 'react-icons/fa'; // Thêm biểu tượng cảnh báo
import './ResetPassword.css';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu và Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password: newPassword });
            setMessage(response.data.message);
            if (response.data.message === "Đặt lại mật khẩu thành công") {
                navigate('/password-reset-success');
            }
        } catch (error) {
            setMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-box">
                <h2 className="reset-password-heading">Đặt Lại Mật Khẩu</h2>
                <p className="reset-password-para">Nhập mật khẩu mới của bạn.</p>
                {message && (
                    <div className="reset-password-message">
                        <FaExclamationCircle className="reset-password-warning-icon" />
                        <span>{message}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="reset-password-input-group">
                        <input 
                            type="password" 
                            id="newPassword" 
                            placeholder="Nhập mật khẩu mới" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="reset-password-input-group">
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            placeholder="Nhập lại mật khẩu mới" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="reset-password-reset-button">Đặt lại mật khẩu</button>
                </form>
                <div className="reset-password-links">
                    <p className="reset-password-para"><Link to="/login">Quay lại đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;