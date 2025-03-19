import React, { useState, useEffect } from 'react';
import api from '../../api';
import './MaterialShow.css';

const MaterialShow = () => {
    const [material, setMaterial] = useState({}); // Khởi tạo là object

    const fetchMaterial = async () => {
        try {
            const materialId = new URLSearchParams(window.location.search).get('material_id');
            const response = await api.get(`http://localhost:5000/api/materials/materials/show/${materialId}`);
            setMaterial(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu tài liệu:', error);
        }
    };

    useEffect(() => {
        fetchMaterial();
    }, []);

    if (!material || Object.keys(material).length === 0) {
        return (
            <div className='p-tag'>
                <p>Đang tải tài liệu...</p>
            </div>
        );
    }

    return (
        <div className="material-video-page">
            <h2>{material[0].title}</h2>
            {material[0].type === 'Video' ? (
                <iframe
                    width="560"
                    height="315"
                    // src="https://www.youtube.com/embed/IKEt2SSmyUE"
                    src={material[0].content_url.startsWith("https://") ? material[0].content_url : "https://www.youtube.com/embed/IKEt2SSmyUE"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-player">
                </iframe>
            ) : (
                <div className='p-tag'>
                    <p>Đây không phải tài liệu dạng video.</p>
                </div>
            )}
        </div>
    );
};

export default MaterialShow;