import React, { useEffect, useState } from "react";
import api from '../../api';
import { useNavigate } from "react-router-dom";
import "./MeListLesson.css";

const MeListLesson = () => {
  const navigate =  useNavigate();
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState({});
  const [assignments, setAssignments] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get("course_id");
        const response = await api.get(
          `http://localhost:5000/api/lessons/lessons/${courseId}`
        );
        setLessons(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài học: ", error);
      }
    };
    fetchLessons();
  }, []);

  const fetchDocuments = async (lessonId) => {
    try {
      const response = await api.get(
        `http://localhost:5000/api/materials/materials/${lessonId}`
      );
      setMaterials((prev) => ({
        ...prev,
        [lessonId]: response.data,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy tài liệu: ", error);
    }
  };

  const fetchAssignments = async (lessonId) => {
    try {
      const response = await api.get(
        `http://localhost:5000/api/assignments/assignments/${lessonId}`
      );
      setAssignments((prev) => ({
       ...prev,
        [lessonId]: response.data,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy tài bài tập: ", error);
    }
  }

  const toggleLesson = (lessonId) => {
    setSelectedLesson((prev) => (prev === lessonId ? null : lessonId));
    if (!materials[lessonId]) {
      fetchDocuments(lessonId);
    }
    if (!assignments[lessonId]) {
      fetchAssignments(lessonId);
    }
  };

  return (
    <div className="lesson-container">
      <h2 className="title">Danh sách bài học</h2>
      {lessons.length === 0 ? (
        <p className="no-lessons">Không có bài học nào trong khóa học này</p>
      ) : (
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <div key={lesson.lesson_id} className="lesson-item">
              <div
                className={`lesson-header ${
                  selectedLesson === lesson.lesson_id ? "selected" : ""
                }`}
                onClick={() => toggleLesson(lesson.lesson_id)}
              >
                <div className="lesson-header-content">
                  <span className="lesson-order">
                    Bài {lesson.lesson_order}:{" "}
                  </span>
                  <span className="lesson-title">{lesson.title}</span>
                </div>
                <div className="lesson-header-function">
                  <button
                    className="btn-lesson"
                    onClick={() => navigate(
                      `/material/${lesson.title.replace(/#/g, '').replace(/\s+/g, '-').toLowerCase()}/create?lesson_id=${lesson.lesson_id}`
                    )}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-lesson"
                    onClick={() => alert(`Xóa bài học: ${lesson.title}`)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
              {selectedLesson === lesson.lesson_id && (
                <div className="lesson-details">
                  <div>
                    <div className="assignment-header">
                      <h4>Bài tập</h4>
                      <div key={lesson.lesson_id} className="assignment-header-btn">
                        <button
                          className="btn-lesson"
                          onClick={() => navigate(
                            `/assignment/${lesson.title.replace(/#/g, '').replace(/\s+/g, '-').toLowerCase()}/create?lesson_id=${lesson.lesson_id}`
                          )}
                        >
                          Thêm
                        </button>
                        <button
                          className="btn-lesson"
                          onClick={() => alert(`Xóa bài tập: ${lesson.lesson_id}`)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    {assignments[lesson.lesson_id]?.length > 0? (
                      assignments[lesson.lesson_id].map((assignment) => (
                        <div key={assignment.assignment_id} className="assignment-item">
                          <span>{assignment.title}</span>
                        </div>
                    ))
                  ) : (
                    <p>Không có tài liệu nào</p>
                  )}
                          
                  </div>
                  <div>
                    <h4>Tài liệu</h4>
                    {materials[lesson.lesson_id]?.length > 0 ? (
                      materials[lesson.lesson_id].map((doc) => (
                        <div key={doc.material_id} className="document-item">
                          <span>{doc.title}</span>
                          <div className="document-item-btn">
                            <button className="btn-lesson" onClick={() => navigate(`/material/${lesson.title.replace(/#/g, '').replace(/\s+/g, '-').toLowerCase()}/update?material_id=${doc.material_id}`)}> Sửa</button>
                            
                            <button
                              className="btn-lesson"
                              onClick={() => alert(`Xóa tài liệu: ${doc.title}`)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Không có tài liệu nào</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeListLesson;