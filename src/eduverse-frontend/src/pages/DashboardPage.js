import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
//import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard">
            <h1>Chào mừng, {user.full_name}</h1>
            <p>Vai trò: {user.role}</p>
            <div className="dashboard-sections">
                <section>
                    <h2>Thông tin cá nhân</h2>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    {/* Thêm các thông tin cá nhân khác */}
                </section>
                <section>
                    <h2>Khóa học của bạn</h2>
                    {/* Liệt kê các khóa học của người dùng */}
                </section>
                <section>
                    <h2>Giao dịch của bạn</h2>
                    {/* Liệt kê các giao dịch của người dùng */}
                </section>
                {user.role === 'Học viên' && (
                    <section>
                        <h2>Chứng chỉ của bạn</h2>
                        {/* Liệt kê các chứng chỉ của người dùng */}
                    </section>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;