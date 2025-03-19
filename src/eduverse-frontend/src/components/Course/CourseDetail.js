import React from 'react';
import { useParams } from 'react-router-dom';
import { courses } from '../Common/courses';

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseInt(id));

  if (!course) {
    return <p>Khóa học không tồn tại.</p>;
  }

  return (
    <div>
      <h1>{course.name}</h1>
      <img src={course.image} alt={course.name} />
      <p>{course.description}</p>
      <p>Giáo viên: {course.teacher}</p>
    </div>
  );
};

export default CourseDetail;