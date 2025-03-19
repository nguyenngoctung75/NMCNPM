import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import Header from '../../components/Common/Header';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

const LoginPage = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);

    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        console.log("Xử lý đăng nhập!");
        e.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/login', values);
                console.log("Response from API:", res.data.message);
                if (res.data.message === "Đăng nhập thành công") {
                    login(res.data.user, res.data.userData, res.data.token); // Sử dụng hàm login từ AuthContext
                    navigate('/');
                } else {
                    alert(res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Form contains errors", validationErrors);
        }
    };

    return (
        <div>
            <div className="home-page">
                <Header />
            </div>
            <div className="login-page">
                {/* <div></>
                <Route path="/" element={<HomePage />} /> */}
                <div className="login-box">
                    <h2 className="login-heading">Đăng nhập</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="login-input-group">
                            <label htmlFor="email" className="login-label">Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={values.email} 
                                onChange={handleInput} 
                                required 
                                className="login-form-control rounded-0"
                            />
                            {errors.email && <span className="login-text-danger">{errors.email}</span>}
                        </div>
                        <div className="login-input-group">
                            <label htmlFor="password" className="login-label">Mật khẩu:</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password"
                                value={values.password}
                                onChange={handleInput} 
                                required 
                                className="login-form-control rounded-0"
                            />
                            {errors.password && <span className="login-text-danger">{errors.password}</span>}
                        </div>
                        <button type="submit" className="login-button">Đăng nhập</button>
                    </form>
                    <div className="login-links">
                        <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                        <p><Link to="/forgot-password">Quên mật khẩu?</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;