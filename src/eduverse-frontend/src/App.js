import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MeListCoursesPage from './pages/MeListCoursesPage';
import CoursesListPage from './pages/CoursesListPage';
import CoursesCreatePage from './pages/CoursesCreatePage';
import CourseUpdatePage from './pages/CoursesUpdatePage';
import LessonCreatePage from './pages/LessonCreatePage';
import LessonShowPage from './pages/LessonShowPage';
import MeListLessonPage from './pages/MeListLessonPage';
import MaterialCreatePage from './pages/MaterialCreatePage';
import MaterialShowPage from './pages/MaterialShowPage';
import MaterialUpdatePage from './pages/MaterialUpdatePage';
import AssignmentCreatePage from './pages/AssignmentCreatePage';
import AssignmentShowPage from './pages/AssignmentShowPage';
import LoginPage from './components/Auth/Login';
import RegisterPage from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import PasswordResetSentPage from './components/Auth/PasswordResetSent';
import ResetPassword from './components/Auth/ResetPassword';
import PasswordResetSuccessPage from './components/Auth/PasswordResetSuccess';
import NotFoundPage from './pages/NotFoundPage';
import MaintenancePage from './pages/MaintenancePage';
import MyLearning from './pages/MyLearningPage';
import ProfilePage from './pages/ProfilePage';
import SearchResults from './components/Common/SearchResults'; // Import trang kết quả tìm kiếm 
import CourseDetail from './components/Course/CourseDetail'; // Import trang chi tiết khóa học
import AdminPageBeta from './pages/AdminPageBetaPage'; // Import trang quản trị viên
import './App.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/course/me/list" element={<MeListCoursesPage />} />
        <Route path="/course/list" element={<CoursesListPage />} />
        <Route path="/course/create" element={<CoursesCreatePage />} />
        <Route path="/course/update" element={<CourseUpdatePage />} />
        <Route path="/lesson/:courseName/create" element={<LessonCreatePage />} />
        <Route path="/lesson/:courseName/show" element={<LessonShowPage />} />
        <Route path="/lesson/:courseName/me/list" element={<MeListLessonPage />} />
        <Route path="/material/:lessonName/create" element={<MaterialCreatePage />} />
        <Route path="/material/:lessonName/show" element={<MaterialShowPage />} />
        <Route path="/material/:lessonName/update" element={<MaterialUpdatePage />} />
        <Route path="/assignment/:lessonName/create" element={<AssignmentCreatePage />} />
        <Route path="/assignment/:lessonName/show" element={<AssignmentShowPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-sent" element={<PasswordResetSentPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/offline" element={<MaintenancePage />} />
        <Route path="/my-learning" component={MyLearning} />
        // context when logged in
        <Route path="/my-profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchResults />} /> 
        <Route path="/coursess/:id" element={<CourseDetail />} />
        <Route path="/admin" element={<AdminPageBeta />} />
      </Routes>
    </Router>
  );
};

export default App;