import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './LessonCreate.css';
import { toast } from '../toast-message/toast-message'

const SubmitLessonForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const [totalLessons, setTotalLessons] = useState(0);

    // Lấy tổng số bài học khi tải trang
    useEffect(() => {
        const fetchTotalLesson = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const courseId = urlParams.get('course_id');
                const response = await api.get('http://localhost:5000/api/lessons/total', {
                    params: { course_id: courseId}
                });
                setTotalLessons(response.data.totalLessons || 0);
            } catch (error) {
                console.error('Lỗi khi lấy tổng số bài học:', error);
                toast({
                    title: "Thất bại!",
                    message: `Lỗi khi lấy tổng số bài học: ${
                        error
                    }`,
                    type: "error",
                    duration: 5000,
                });
            }
        };

        fetchTotalLesson();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('course_id');

        try {
            const response = await api.post('http://localhost:5000/api/lessons/create', {
                ...formData,
                lesson_order: totalLessons + 1, // Tăng số bài học lên 1
                course_id: courseId,
            });

            console.log('Response:', response.data);
            toast({
                title: "Thành công!",
                message: "Bài học đã được tạo thành công!",
                type: "success",
                duration: 3000,
            });
            setTimeout(() => {
                navigate('/course/me/list');
            }, 1000);

            setFormData({
                title: '',
                content: '',
            });
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            toast({
                title: "Thất bại!",
                message: `Có lỗi xảy ra: ${
                    error.response?.data?.message || error.message
                }`,
                type: "error",
                duration: 5000,
            });
        }
    };

    return (
        <div className="submit-course-form">
            <h2>Thêm Bài Học</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên bài học:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nội dung:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Thứ tự bài học:</label>
                    <input
                        type="number"
                        name="lesson_order"
                        value={totalLessons + 1} // Hiển thị số thứ tự bài học mới
                        readOnly
                        required
                    />
                </div>

                <button className="btn-lesson-create" type="submit">Thêm bài học</button>
                {/* Toast container */}
                <div id="toast"></div>
            </form>
        </div>
    );
};

export default SubmitLessonForm;