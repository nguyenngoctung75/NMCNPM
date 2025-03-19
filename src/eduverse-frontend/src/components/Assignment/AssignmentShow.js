import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './AssignmentShow.css';

const AssignmentShow = () => {
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null); // Thay vì mảng rỗng, sử dụng `null` để kiểm tra dữ liệu dễ dàng hơn
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const assignmentId = urlParams.get("assignment_id");
                const response = await api.get(`http://localhost:5000/api/assignments/assignments/show/${assignmentId}`);
                setAssignment(response.data); // Giả sử API trả về một đối tượng assignment
            } catch (err) {
                console.error("Error fetching assignment details:", err);
            }
        };

        fetchAssignment();
    }, []);


    if (!assignment) {
        return <p>Đang tải thông tin bài tập...</p>;
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("Vui lòng chọn một tệp để nộp bài.");
            return;
        }

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const assignmentId = urlParams.get("assignment_id");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("assignment_id", assignmentId);

            // Gửi request đến API nộp bài
            const response = await api.post(`http://localhost:5000/api/assignments/assignments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert("Nộp bài thành công!");
                setFile(null); // Reset file sau khi nộp thành công
            }
        } catch (err) {
            console.error("Error submitting assignment:", err);
            alert("Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại.");
        }
    };

    return (
        <div className="assignment-show">
            <h1 className="assignment-title">{assignment[0].title}</h1>
            <p className="assignment-description">{assignment[0].description}</p>
            <p className="assignment-description">Điểm tối đa: {assignment[0].points}</p>
            <p className="assignment-description">Số lần submit: {assignment[0].max_attemps}</p>

            <div className="assignment-details">
                <p><strong>Hạn chót:</strong> {new Date(assignment[0].due_date).toLocaleString()}</p>
            </div>

            <div className="assignment-attachments">
                {['attachment1', 'attachment2'].map((key, index) => (
                    assignment[0][key] && (
                        <div key={index}>
                            <h3>Tệp đính kèm {index + 1}:</h3>
                            <ul>
                                <li>
                                    <a href={assignment[0][key]} target="_blank" rel="noopener noreferrer">
                                        Tệp {index + 1}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )
                ))}
            </div>

            <div className="assignment-actions">
                <div className="submit-section">
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div className='btn-assignment-show'>
                    <button className="submit-button" onClick={handleSubmit}>Nộp bài</button>
                    <button className="back-button" onClick={() => navigate(-1)}>Quay lại</button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentShow;