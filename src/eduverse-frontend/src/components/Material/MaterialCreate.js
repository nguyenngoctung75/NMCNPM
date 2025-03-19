import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './MaterialCreate.css';
import { toast } from '../toast-message/toast-message'

const MaterialCreate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        type: '',
    });

    const [file, setFile] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson_id');

        // Kiểm tra xem file đã được chọn chưa
        if (!file) {
            toast({
                title: "Lỗi!",
                message: "Vui lòng chọn 1 file!",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            const fileData = new FormData();

            // Thêm các trường từ `formData` vào `FormData`
            Object.keys(formData).forEach((key) => {
                fileData.append(key, formData[key]);
            });

            // Thêm `lesson_id`
            fileData.append('lesson_id', lessonId);

            // Thêm file
            fileData.append('file', file);

            const response = await api.post('http://localhost:5000/api/materials/materials', fileData);

            console.log('Response:', response.data);
            // alert('Tài liệu đã được thêm thành công!');
            toast({
                title: "Thành công!",
                message: "Tài liệu đã được thêm thành công!",
                type: "success",
                duration: 3000,
            });
            setTimeout(() => {
                navigate(-1);
            }, 1000);

            setFormData({
                title: '',
                type: '',
            });
            setFile(null);
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
            <h2>Thêm Tài Liệu</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Tên tài liệu:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <div className="radio-group">
                        <label>Loại tài liệu:</label>
                        <label className="radio-label">
                            <div>Tài liệu</div>
                            <input
                                type="radio"
                                name="type"
                                value="Tài liệu"
                                checked={formData.type === 'Tài liệu'}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label className="radio-label">
                            <div>Video</div>
                            <input
                                className="radio-label-input"
                                type="radio"
                                name="type"
                                value="Video"
                                checked={formData.type === 'Video'}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Chọn file:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="*/*"
                        required
                    />
                </div>

                <button className="btn-material-create" type="submit">Thêm tài liệu</button>
                {/* Toast container */}
                <div id="toast"></div>
            </form>
        </div>
    );
};

export default MaterialCreate;