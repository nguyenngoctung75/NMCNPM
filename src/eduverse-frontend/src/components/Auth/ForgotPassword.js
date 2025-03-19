import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaExclamationCircle } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            if (response.data.message === 'Đã gửi liên kết đặt lại mật khẩu đến email của bạn') {
                navigate('/password-reset-sent');
            } else {
                setError('Vui lòng kiểm tra lại email');
            }
        } catch (error) {
            setError('Vui lòng kiểm tra lại email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-box">
                <h2 className="forgot-password-heading">Quên Mật Khẩu</h2>
                <p className="forgot-password-para">Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
                <form onSubmit={handleSubmit}>
                    <div className="forgot-password-input-group">
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Nhập email của bạn" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && (
                        <div className="forgot-password-error-message">
                            <FaExclamationCircle className="forgot-password-warning-icon" />
                            <span>{error}</span>
                        </div>
                    )}
                    <button type="submit" className="forgot-password-reset-button" disabled={isLoading}>
                        {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
                    </button>
                </form>
                <div className="forgot-password-links">
                    <p className="forgot-password-para"><Link to="/login">Quay lại đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;