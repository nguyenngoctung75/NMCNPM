export const searchCourses = (courses, query) => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.teacher.toLowerCase().includes(query.toLowerCase())
    );
  };
  