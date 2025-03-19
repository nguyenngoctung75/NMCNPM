import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Header.css';  
import logo from '../../assets/images/EduVerse_apose_1.svg'; 
import { FaSearch, FaCaretDown, FaGlobe, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser, FaBook, FaWallet, FaCertificate, FaCog, FaBell } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { searchCourses } from './search'; // Import hàm tìm kiếm
import { courses } from './courses'; // Import dữ liệu giả lập
import axios from 'axios'; // Thêm axios để thực hiện HTTP requests

const Header = () => {
  const { isLoggedIn, userAvatar, logout, userRole, notifications, setNotifications } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false); // dropdown Khám phá
  const [languageOpen, setLanguageOpen] = useState(false); // dropdown ngôn ngữ
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false); // dropdown Avatar
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false); // dropdown Thông báo
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false); // Trạng thái của hộp kết quả tìm kiếm
  const [unreadCount, setUnreadCount] = useState(0); // Thêm trạng thái để lưu số lượng thông báo chưa đọc
  const searchRef = useRef(null); // Tham chiếu đến ô tìm kiếm
  const navigate = useNavigate(); 

  const markAllAsRead = async () => {
    try {
      const response = await axios.put('/api/notifications/mark-all-read'); // Giả sử API có endpoint này
      if (response.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({ ...notification, is_read: 1 }))
        );
        setUnreadCount(0); // Cập nhật số lượng thông báo chưa đọc
      }
    } catch (error) {
      console.error('Error marking notifications as read', error);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('/api/notifications/unread-count'); // Giả sử API có endpoint này
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Error fetching unread notifications count', error);
      }
    };

    if (isLoggedIn) {
      fetchUnreadCount(); // Chỉ fetch khi người dùng đã đăng nhập
    }
  }, [isLoggedIn]);

  // Hàm để mở/tắt dropdown Khám phá
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Hàm để mở/tắt dropdown ngôn ngữ
  const toggleLanguageDropdown = () => setLanguageOpen(!languageOpen);

  // Hàm để mở/tắt dropdown Avatar
  const toggleAvatarMenu = () => setAvatarMenuOpen(!avatarMenuOpen);

  // Hàm để mở/tắt dropdown Thông báo
  const toggleNotificationMenu = () => {
    if (notificationMenuOpen) {
      setNotificationMenuOpen(false);
    } else {
      markAllAsRead(); // Đánh dấu tất cả thông báo là đã đọc trước khi mở menu
      setNotificationMenuOpen(true);
    }
  };  

  // Hàm đăng xuất
  const handleLogout = () => { 
    logout(); 
    navigate('/'); 
  };

  // Hàm tìm kiếm
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  useEffect(() => {
    const results = searchCourses(courses, searchQuery);
    setSearchResults(results);
  }, [searchQuery]);

  // Hiển thị kết quả khi focus vào ô tìm kiếm
  const handleFocus = () => {
    setSearchOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (!e.target.closest('.header-search-result-item')) {
          setSearchOpen(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    setSearchOpen(false); 
  };

  return (
    <header className="header">
      <div className="header-toolbar">
        {/* Logo */}
        <a href="/">
          <img src={logo} alt="EduVerse Logo" className="header-logo" />
        </a>

        {/* Dropdown Khám phá */}
        <div className="header-dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
          <button className="header-dropdown-button">
            Khám phá <FaCaretDown />
          </button>
          {dropdownOpen && (
            <div className="header-dropdown-content">
              {/* Danh sách các lĩnh vực khóa học */}
              <div className="header-dropdown-category">Lập trình</div>
              <div className="header-dropdown-category">Kinh doanh</div>
              <div className="header-dropdown-category">Tài chính - Kế toán</div>
              <div className="header-dropdown-category">Văn phòng</div>
              <div className="header-dropdown-category">Thiết kế</div>
              <div className="header-dropdown-category">Marketing</div>
              <div className="header-dropdown-category">Nhiếp ảnh</div>
              <div className="header-dropdown-category">Sức khỏe - Thể dục</div>
              <div className="header-dropdown-category">Âm nhạc - Mỹ thuật</div>
              <div className="header-dropdown-category">Khác</div>
            </div>
          )}
        </div>

        {/* Khung tìm kiếm */}
        <div className={`header-search-bar ${searchOpen ? 'active' : ''}`} ref={searchRef}>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="header-search-input" 
            value={searchQuery} 
            onChange={handleSearchChange} 
            onKeyPress={handleKeyPress} 
            onFocus={handleFocus} 
          />
          <button 
            className="header-search-button" 
            onClick={() => navigate(`/search?q=${searchQuery}`)}
          >
            <FaSearch />
          </button>
          {searchOpen && (
            <div className="header-search-results">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map(course => (
                    <li 
                      key={course.id} 
                      className="header-search-result-item" 
                      onClick={() => handleResultClick(course.id)}
                    >
                      <img 
                        src={course.image} 
                        alt={course.name} 
                        className="header-search-result-image" 
                      />
                      <div className="header-search-result-info">
                        <h3>{course.name}</h3>
                        <p>{course.description}</p>
                        <p>Giáo viên: {course.teacher}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                searchQuery && <p className="header-no-search-results">Không tìm thấy khóa học nào phù hợp.</p>
              )}
            </div>
          )}
        </div>

        {/* Các nút Đăng nhập, Đăng ký hoặc Ảnh đại diện người dùng */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="header-btn"><FaSignInAlt />Đăng nhập</Link>
            <Link to="/register" className="header-btn"><FaUserPlus />Đăng ký</Link>
          </>
        ) : (
          <div className="header-user-section">
            <div className="header-notification-section" onMouseEnter={toggleNotificationMenu} onMouseLeave={toggleNotificationMenu}>
              <FaBell className="header-notification-icon" />
              {unreadCount > 0 && <span className="header-notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              {notificationMenuOpen && (
                <div className="header-notification-menu">
                  {notifications.slice(0, 6).map((notification, index) => (
                    <div key={index} className={`header-notification-item ${notification.is_read ? 'read' : 'unread'}`}>
                      <FaBell className="header-notification-item-icon" />
                      <div className="header-notification-item-text">
                        {notification.message}
                      </div>
                      <div className="header-notification-item-time">
                        {new Date(notification.sent_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {notifications.length > 6 && (
                    <Link to="/notifications" className="header-notification-more">
                      Xem thêm
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div onMouseEnter={toggleAvatarMenu} onMouseLeave={toggleAvatarMenu}>
              <img src={userAvatar} alt="User Avatar" className="header-avatar" />
              {avatarMenuOpen && (
                <div className="header-avatar-menu">
                  <Link to="/my-profile" className="header-avatar-menu-item"><FaUser /> Hồ sơ của tôi</Link>
                  {(userRole === 'Học viên' || userRole === 'Giáo viên') && (
                    <Link to="/course/me/list" className="header-avatar-menu-item"><FaBook /> Khóa học của tôi</Link>
                  )}
                  {(userRole === 'Quản trị viên') && (
                    <Link to="/admin" className="header-avatar-menu-item">Trang quản trị</Link>
                  )}
                  {(userRole === 'Học viên') && (
                    <Link to="/certificates" className="header-avatar-menu-item"><FaCertificate />Chứng chỉ của tôi</Link>
                  )}
                  <Link to="/transactions" className="header-avatar-menu-item"><FaWallet /> Giao dịch</Link>
                  <Link to="/settings" className="header-avatar-menu-item"><FaCog /> Cài đặt</Link>
                  <Link onClick={handleLogout} className="header-avatar-menu-item"><FaSignOutAlt /> Đăng xuất</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dropdown chọn ngôn ngữ */}
        <div className="header-language-dropdown" onMouseEnter={toggleLanguageDropdown} onMouseLeave={toggleLanguageDropdown}>
          <button className="header-language-button"><FaGlobe /></button>
          {languageOpen && (
            <div className="header-language-content">
              {/* Danh sách các ngôn ngữ */}
              <div className="header-language-option">English</div>
              <div className="header-language-option">Vietnamese</div>
              <div className="header-language-option">Chinese</div>
              <div className="header-language-option">Japanese</div>
              <div className="header-language-option">Russian</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;