import './AssignmentCreate.css';
import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from '../toast-message/toast-message';

const AssignmentCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        points: '',
        max_attempts: '',
    });

    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)); // Chấp nhận nhiều tệp
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson_id');

        if (files.length === 0) {
            toast({
                title: "Lỗi!",
                message: "Vui lòng chọn ít nhất 1 file!",
                type: "error",
                duration: 5000,
            });
            return;
        }

        try {
            const fileData = new FormData();
            Object.keys(formData).forEach((key) => {
                fileData.append(key, formData[key]);
            });
            fileData.append('lesson_id', lessonId);
            files.forEach((file) => {
                fileData.append('files', file); // Thêm tất cả các tệp
            });

            const response = await api.post('http://localhost:5000/api/assignments/assignments', fileData);
            console.log('Response:', response.data);
            toast({
                title: "Thành công!",
                message: "Bài tập đã được thêm thành công!",
                type: "success",
                duration: 3000,
            });
            setTimeout(() => {
                navigate(-1);
            }, 1000);

            setFormData({
                title: '',
                description: '',
                due_date: '',
                points: '',
                max_attempts: '',
            });
            setFiles([]);
        } catch (error) {
            toast({
                title: "Thất bại!",
                message: `Có lỗi xảy ra: ${error.response?.data?.message || error.message}`,
                type: "error",
                duration: 5000,
            });
        }
    };

    return (
        <div className="assignment-create">
            <h2>Tạo Bài Tập</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Tên bài:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Miêu tả:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Hạn nộp:</label>
                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Điểm</label>
                    <input
                        type="number"
                        name="points"
                        value={formData.points}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Số lần nộp tối đa:</label>
                    <input
                        type="number"
                        name="max_attempts"
                        value={formData.max_attempts}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Chọn file:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="*/*"
                        multiple
                        required
                    />
                </div>

                <button className="btn-material_create" type="submit">Thêm bài tập</button>
                <div id="toast"></div>
            </form>
        </div>
    );
}

export default AssignmentCreate;