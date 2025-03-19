import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { courses } from './courses';
import './SearchResults.css'; 

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="search-results-container">
      <h1>Kết quả tìm kiếm cho "{searchQuery}"</h1>
      {filteredCourses.length > 0 ? (
        <ul className="search-results-list">
          {filteredCourses.map(course => (
            <li key={course.id} className="search-result-item">
              <Link to={`/courses/${course.id}`}>
                <img src={course.image} alt={course.name} className="search-result-image" />
                <div className="search-result-info">
                  <h2>{course.name}</h2>
                  <p>{course.description}</p>
                  <p className="search-result-teacher">Giáo viên: {course.teacher}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-search-results">Không tìm thấy khóa học nào phù hợp.</p>
      )}
    </div>
  );
};

export default SearchResults;