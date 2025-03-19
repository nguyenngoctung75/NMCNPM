import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './RegisterValidation';
import axios from 'axios';
import './Register.css';

const RegisterPage = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        confirmEmail: '',
        password: '',
        termsAccepted: false,
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0 && values.email === values.confirmEmail) {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/register', values);
                if (res.data.message === "Đăng ký thành công") {
                    navigate('/login');
                } else {
                    alert(res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            if (values.email !== values.confirmEmail) {
                alert('Email và Email xác nhận không khớp.');
            }
            console.log("Form contains errors", validationErrors);
        }
    };

    return (
        <div className="register-page">
            <div className="register-box">
                <h2 className="register-heading">Đăng ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className="register-input-group">
                        <label htmlFor="name" className="register-label">Tên:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Nhập tên của bạn"
                            value={values.name} 
                            onChange={handleInput} 
                            required 
                            className="register-form-control rounded-0"
                        />
                        {errors.name && <span className="register-text-danger">{errors.name}</span>}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="email" className="register-label">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Nhập email của bạn"
                            value={values.email} 
                            onChange={handleInput} 
                            required 
                            className="register-form-control rounded-0"
                        />
                        {errors.email && <span className="register-text-danger">{errors.email}</span>}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="confirmEmail" className="register-label">Nhập lại Email:</label>
                        <input 
                            type="email" 
                            id="confirmEmail" 
                            name="confirmEmail" 
                            placeholder="Nhập lại email"
                            value={values.confirmEmail} 
                            onChange={handleInput} 
                            required 
                            className="register-form-control rounded-0"
                        />
                        {errors.confirmEmail && <span className="register-text-danger">{errors.confirmEmail}</span>}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="password" className="register-label">Mật khẩu:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Mật khẩu có ít nhất 6 ký tự"
                            value={values.password} 
                            onChange={handleInput} 
                            required 
                            className="register-form-control rounded-0"
                        />
                        {errors.password && <span className="register-text-danger">{errors.password}</span>}
                    </div>
                    <div className="register-terms">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            name="termsAccepted"
                            checked={values.termsAccepted} 
                            onChange={handleInput} 
                        />
                        <label htmlFor="terms" className="register-label">Tôi đồng ý với chính sách về quyền riêng tư và điều khoản dịch vụ</label>
                    </div>
                    <button 
                        type="submit" 
                        className={`register-button ${values.termsAccepted ? 'active' : 'disabled'}`} 
                        disabled={!values.termsAccepted}
                    >
                        Đăng ký
                    </button>
                </form>
                <div className="register-links">
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;