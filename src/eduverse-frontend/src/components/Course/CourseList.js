import React, { useState, useEffect } from 'react';
import { FaListUl } from "react-icons/fa6";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import api from '../../api';
import { Link } from 'react-router-dom';
import './CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('http://localhost:5000/api/courses/list');
                setCourses(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };
        fetchCourses();
    }, []);

    const totalPages = Math.ceil(courses.length / itemsPerPage);

    const paginate = (page) => {
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const pageRange = 1; // Số trang trước và sau trang hiện tại được hiển thị
    
        // Hiển thị các trang đầu và "..."
        if (currentPage > 4) {
            pages.push(
                <button key={1} className={`page-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => paginate(1)}>
                    1
                </button>
            );
            pages.push(<span key="dots-start" className="dots">...</span>);
        } else {
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
                pages.push(
                    <button key={i} className={`page-btn ${currentPage === i ? 'active' : ''}`} onClick={() => paginate(i)}>
                        {i}
                    </button>
                );
            }
        }
    
        // Hiển thị các trang gần trang hiện tại
        for (let i = Math.max(4, currentPage - pageRange); i <= Math.min(totalPages - 3, currentPage + pageRange); i++) {
            pages.push(
                <button key={i} className={`page-btn ${currentPage === i ? 'active' : ''}`} onClick={() => paginate(i)}>
                    {i}
                </button>
            );
        }
    
        // Hiển thị "..." và các trang cuối
        if (currentPage < totalPages - 3) {
            pages.push(<span key="dots-end" className="dots">...</span>);
            for (let i = totalPages; i <= totalPages; i++) {
                pages.push(
                    <button key={i} className={`page-btn ${currentPage === i ? 'active' : ''}`} onClick={() => paginate(i)}>
                        {i}
                    </button>
                );
            }
        } else {
            for (let i = Math.max(4, totalPages - 2); i <= totalPages; i++) {
                pages.push(
                    <button key={i} className={`page-btn ${currentPage === i ? 'active' : ''}`} onClick={() => paginate(i)}>
                        {i}
                    </button>
                );
            }
        }
    
        return pages;
    };
    
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <section className='course-list'>
            <div className='title-holder'>
                <h2><FaListUl />Danh sách khóa học</h2>
            </div>
            <div className="course-grid">
                {currentCourses.map((course) => (
                    <div className="course-card" key={course.course_id}>
                        <div className="image">
                            <img src={course.cover_image} alt="Khóa học" className="course-img" 
                                onError={(e) => {
                                    e.target.onerror = null; // Prevents looping
                                    e.target.src = 'https://soict.hust.edu.vn/wp-content/uploads/2019/05/a.jpg'; // Specify your fallback image path
                                }}
                            />
                        </div>
                        <div className="content">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                        </div>
                        <div className="card-footer">
                            <span className="price">Giá: {course.price} $</span>
                            <Link to={{
                                pathname: `/lesson/${course.title.replace(/#/g, '').replace(/\s+/g, '-').toLowerCase()}/show`, 
                                search: `?course_id=${course.course_id}`
                            }} className="btn"><LiaLaptopCodeSolid /> Học Ngay</Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    className="page-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {renderPageNumbers()}
                <button
                    className="page-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </section>
    );
};

export default CourseList;