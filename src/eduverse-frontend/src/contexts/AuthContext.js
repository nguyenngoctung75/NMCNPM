import React, { createContext, useState, useEffect } from 'react';
import defaultAvatar from '../assets/images/default_user.jpg';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userAvatar, setUserAvatar] = useState(defaultAvatar);
  const [userRole, setUserRole] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong localStorage hay không
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userData'));
    console.log('defaultAvatar:', defaultAvatar); 
    if (storedUser) {
      setIsLoggedIn(storedUser);
      setUser(storedUser);
      const Role = storedUser.role;
      setUserRole(Role);
    }
    if (storedUserInfo){
      setUserInfo(storedUserInfo);
      const profilePicture = storedUserInfo.personalInfo?.[0]?.profile_picture;
      const avatar = profilePicture ? profilePicture : defaultAvatar; 
      setUserAvatar(avatar);

      const storedNotifications = storedUserInfo.notifications;
      if (storedNotifications) {
        setNotifications(storedNotifications); // Lấy tất cả thông báo
      }

    }else {
      setUserAvatar(defaultAvatar); // Đặt ảnh mặc định nếu không có storedUserInfo
    }
  }, []);

  const logout = () => {
    // Xóa các thông tin khỏi localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');

    // Cập nhật trạng thái đăng nhập
    setIsLoggedIn(false);
  };

  const login = (user, userData, token) => {
    // Cập nhật localStorage với thông tin đăng nhập
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(userData));

    // Cập nhật trạng thái đăng nhập
    setIsLoggedIn(true);
    setUser(user);
    setUserInfo(userData);
    const profilePicture = userData.personalInfo?.[0]?.profile_picture;
    const avatar = profilePicture ? profilePicture : defaultAvatar; 
    setUserAvatar(avatar);

    const storedNotifications = userData.notifications;
    if (storedNotifications) {
      setNotifications(storedNotifications); // Lấy tất cả thông báo
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, userInfo, setUserInfo, userAvatar, setUserAvatar, logout, login, userRole, setUserRole, notifications }}>
      {children}
    </AuthContext.Provider>
  );
};