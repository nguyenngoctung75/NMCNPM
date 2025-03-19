import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './MaterialUpdate.css';
import { toast } from '../toast-message/toast-message';

const MaterialUpdate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        content_url: '',
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const materialId = urlParams.get('material_id');
                const response = await api.get(`http://localhost:5000/api/materials/materials/show/${materialId}`);
                const materialData = Array.isArray(response.data) ? response.data[0] : response.data;
                setFormData(materialData); // Đổ dữ liệu vào formData
            } catch (error) {
                console.error('Lỗi khi tải thông tin tài liệu:', error);
                toast({
                    title: 'Thất bại!',
                    message: 'Không thể tải thông tin tài liệu!',
                    type: 'error',
                    duration: 5000,
                });
            }
        };
        fetchMaterial();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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
        const materialId = urlParams.get('material_id');

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('type', formData.type);
        if (file) formDataToSend.append('file', file);

        try {
            await api.put(`http://localhost:5000/api/materials/materials/update/${materialId}`, formDataToSend);

            toast({
                title: 'Thành công!',
                message: 'Tài liệu đã được cập nhật thành công!',
                type: 'success',
                duration: 3000,
            });

            setTimeout(() => navigate(-1), 1000);
        } catch (error) {
            console.error('Lỗi khi cập nhật tài liệu:', error);
            toast({
                title: 'Thất bại!',
                message: `Có lỗi xảy ra: ${error.response?.data?.message || error.message}`,
                type: 'error',
                duration: 5000,
            });
        }
    };

    return (
        <div className="material-update-form">
            <h2>Cập nhật thông tin tài liệu</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Tiêu đề:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Loại tài liệu:</label>
                    <select
                        name="type"
                        value={formData.type || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn loại tài liệu</option>
                        <option value="Video">Video</option>
                        <option value="Tài liệu">Document</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>File tải lên (tùy chọn):</label>
                    <input
                        type="file"
                        name="file"
                        accept="video/*,application/pdf,image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" className="btn-submit-material-update">
                    Cập nhật tài liệu
                </button>
                {/* Toast container */}
                <div id="toast"></div>
            </form>
        </div>
    );
};

export default MaterialUpdate;