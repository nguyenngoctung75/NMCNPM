import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css'

const AdminPage = () => {
    const [summary, setSummary] = useState({ teacherCount: 0, studentCount: 0, courseCount: 0 });
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Lấy dữ liệu tổng quan
        axios.get(`http://localhost:5000/api/admin/summary`)
            .then((res) => setSummary(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleCreateTeacher = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/admin/create-teacher', newTeacher)
            .then((res) => setMessage(res.data.message))
            .catch((err) => setMessage(err.response.data.message || 'Lỗi khi tạo giáo viên'));
    };

    return (
        <div className='container-main'>
            <h1>Quản trị</h1>
            <h2>Tổng quan</h2>
            <ul>
                <li>Số lượng giáo viên: {summary.teacherCount}</li>
                <li>Số lượng học viên: {summary.studentCount}</li>
                <li>Tổng số lượng khóa học: {summary.courseCount}</li>
            </ul>

            <h2>Tạo giáo viên mới</h2>
            <form onSubmit={handleCreateTeacher}>
                <input
                    type="text"
                    placeholder="Tên"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                    required
                />
                <button type="submit">Tạo giáo viên</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminPage;
