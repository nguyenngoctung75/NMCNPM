import React, { useState, useEffect } from 'react';
import './CourseUpdate.css';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from '../toast-message/toast-message'
const CourseUpdate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        category: '',
        price: '',
        cover_image: '',
        status: '',
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const courseId = urlParams.get('course_id');
                const response = await api.get(`http://localhost:5000/api/courses/detail/${courseId}`);
                // Kiểm tra nếu response trả về mảng
                const courseData = Array.isArray(response.data) ? response.data[0] : response.data;
                setFormData(courseData); // Đổ dữ liệu vào formData
            } catch (error) {
                console.error('Lỗi khi tải thông tin khóa học:', error);
                toast({
                    title: 'Thất bại!',
                    message: 'Không thể tải thông tin khóa học!',
                    type: 'error',
                    duration: 5000,
                });
            }
        };
        fetchCourse();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Gửi dữ liệu tới server API
        
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const courseId = urlParams.get('course_id');
            const response = await api.put(`http://localhost:5000/api/courses/update/${courseId}`, formData);
            
            console.log('Response:', response.data);
            // alert('Khóa học đã được gửi thành công!');
            toast({
                title: "Thành công!",
                message: "Khóa học đã được chỉnh sửa thành công!",
                type: "success",
                duration: 3000,
            });
            setTimeout(() => {
                navigate('/course/list');
            }, 1000);
    
            // Reset form data
            setFormData({
                title: '',
                description: '',
                duration: '',
                category: '',
                price: '',
                cover_image: '',
                status: '',
            });
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            // alert(
            //     `Có lỗi xảy ra: ${
            //         error.response?.data?.message || error.message
            //     }`
            // );
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
            <h2>Chỉnh sửa thông tin khóa học</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Tên khóa học:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title || ''} // Kiểm tra giá trị null/undefined
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Miêu tả:</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Thời Lượng:</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Thể loại:</label>
                    <input
                        name="category"
                        value={formData.category || ''}
                        onChange={handleChange}
                        required
                    ></input>
                </div>

                <div className="form-group">
                    <label>Giá:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Ảnh khóa học:</label>
                    <input
                        type="text"
                        name="cover_image"
                        value={formData.cover_image || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Trạng thái:</label>
                    <select
                        name="status"
                        value={formData.status || ''}
                        onChange={handleChange}
                    >
                        <option value="Đang hoạt động">Đang hoạt động</option>
                        <option value="Không hoạt động">Không hoạt động</option>
                        <option value="Sắp ra mắt">Sắp ra mắt</option>
                        <option value="Đang tạm dừng">Đang tạm dừng</option>
                        <option value="Đã xóa">Đã xóa</option>
                    </select>
                </div>

                <button className="btn-course_create" type="submit">Chỉnh sửa khóa học</button>
                {/* Toast container */}
                <div id="toast"></div>
            </form>

        </div>
    );
};

export default CourseUpdate;