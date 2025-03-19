import React, { useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { TbBookUpload } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { FaListUl } from "react-icons/fa6";
import { MdPostAdd } from "react-icons/md";
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import './MeListCourses.css';

const UserCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách khóa học của user
        const fetchCourses = async () => {
            try {
                const response = await api.get(`http://localhost:5000/api/courses/me/list`);
                setCourses(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khóa học:', error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="user-courses">
            <h2><FaListUl />  Danh sách khóa học bạn đã đăng</h2>
            <div className="add-button">
                <button className='btn-course-add' onClick={() => navigate('/course/Create')}><MdPostAdd /> Thêm khóa học</button>
            </div>
            {courses.length === 0 ? (
                <p style={{textAlign: "center"}}>Bạn chưa đăng khóa học nào.</p>
            ) : (
                <div className="course-list">
                    {courses.map((course) => (
                        <div className="course-item" key={course.course_id}>
                            <img src={course.cover_image} alt={course.title} className="course-image" 
                                onError={(e) => {
                                    e.target.onerror = null; // Prevents looping
                                    e.target.src = 'https://soict.hust.edu.vn/wp-content/uploads/2019/05/a.jpg'; // Specify your fallback image path
                                }}
                            />
                            <div className="course-info">
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <p><strong>Giá:</strong> {course.price} $</p>
                                <p><strong>Trạng thái:</strong> {course.status}</p>
                            </div>
                            <div className="course-actions">
                                <button onClick={() => 
                                    navigate(
                                        `/lesson/${course.title.replace(/#/g, '').replace(/\s+/g, '-').toLowerCase()}/create?course_id=${course.course_id}`
                                    )}><TbBookUpload /> Đăng bài học
                                </button>
                                <button onClick={() => 
                                    navigate(
                                        `/lesson/${course.title.replace(/#/g, '').replace(/\s+/g, '-').toLowerCase()}/me/list?course_id=${course.course_id}`
                                    )}><FaSearch /> Chi tiết
                                </button>
                                <button onClick={() => navigate(`/course/update?course_id=${course.course_id}`)}><CiEdit /> Sửa</button>
                                <button onClick={() => navigate('/course/delete')}><FaTrash /> Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserCourses;