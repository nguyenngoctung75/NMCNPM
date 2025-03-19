import React, { useEffect, useState } from 'react';
import api from '../api';

function MyLearning() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await api.get('/my-learning');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses', error);
            }
        }

        fetchCourses();
    }, []);

    return (
        <div>
            <h1>My Courses</h1>
            <div>
                {courses.map(course => (
                    <div key={course.id}>
                        <img src={course.imageUrl} alt={course.title} />
                        <h2>{course.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyLearning;
