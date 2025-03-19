import React from 'react';
import './MainContent.css';
import { FaCheckCircle, FaStar, FaClipboardList, FaLaptopCode } from 'react-icons/fa';
import image1 from '../../assets/images/MainContent1.png';
import image2 from '../../assets/images/MainContent2.png';
import image3 from '../../assets/images/MainContent3.png';
import image4 from '../../assets/images/MainContent4.png';
import avatar from '../../assets/images/MainContent-Avatar.jpg';

const MainContent = () => {
    return (
        <div className="main-content">
            {/* Phần giới thiệu nhanh */}
            <section className="quick-intro">
                <div className="intro-card">
                    <img src={image1} alt="Đào tạo thực hành" className="intro-image" />
                    <FaLaptopCode className="icon" />
                    <h3>Đào tạo thực hành</h3>
                    <p>Cung cấp các khóa học thực hành giúp bạn áp dụng kiến thức vào thực tiễn.</p>
                </div>
                <div className="intro-card">
                    <img src={image2} alt="Chất lượng chuyên sâu" className="intro-image" />
                    <FaStar className="icon" />
                    <h3>Chất lượng chuyên sâu</h3>
                    <p>Các khóa học chất lượng với nội dung chuyên sâu và giảng viên hàng đầu.</p>
                </div>
                <div className="intro-card">
                    <img src={image3} alt="Tài liệu phong phú" className="intro-image" />
                    <FaClipboardList className="icon" />
                    <h3>Tài liệu phong phú</h3>
                    <p>Đa dạng tài liệu học tập, từ sách đến video, giúp bạn học tập hiệu quả.</p>
                </div>
                <div className="intro-card">
                    <img src={image4} alt="Thuận tiện và linh hoạt" className="intro-image" />
                    <FaCheckCircle className="icon" />
                    <h3>Thuận tiện và linh hoạt</h3>
                    <p>Học mọi lúc, mọi nơi với các khóa học trực tuyến tiện lợi và linh hoạt.</p>
                </div>
            </section>

            {/* Phần nhận xét */}
            <section className="reviews">
                <div className="review-card">
                    <p className="review-text">"Khóa học này đã thay đổi cách tôi nhìn nhận về lập trình. Rất hữu ích!"</p>
                    <div className="reviewer">
                        <img src={avatar} alt="Reviewer" className="reviewer-avatar" />
                        <div className="reviewer-info">
                            <strong>Nguyễn Văn A</strong>
                            <p>Developer tại XYZ Corp</p>
                            <p>Chuyên gia trong lĩnh vực Front-end</p>
                        </div>
                    </div>
                </div>
                <div className="review-card">
                    <p className="review-text">"Nội dung chất lượng và giảng viên rất tận tâm. Tôi học được rất nhiều!"</p>
                    <div className="reviewer">
                        <img src={avatar} alt="Reviewer" className="reviewer-avatar" />
                        <div className="reviewer-info">
                            <strong>Trần Thị B</strong>
                            <p>Project Manager tại ABC Inc</p>
                            <p>Kinh nghiệm quản lý dự án nhiều năm</p>
                        </div>
                    </div>
                </div>
                <div className="review-card">
                    <p className="review-text">"Khóa học linh hoạt và dễ dàng tham gia. Tôi có thể học mọi lúc mọi nơi."</p>
                    <div className="reviewer">
                        <img src={avatar} alt="Reviewer" className="reviewer-avatar" />
                        <div className="reviewer-info">
                            <strong>Lê Văn C</strong>
                            <p>Freelancer</p>
                            <p>Chuyên về phát triển web và ứng dụng</p>
                        </div>
                    </div>
                </div>
                <div className="review-card">
                    <p className="review-text">"Tài liệu học tập phong phú và dễ hiểu. Rất đáng để tham gia!"</p>
                    <div className="reviewer">
                        <img src={avatar} alt="Reviewer" className="reviewer-avatar" />
                        <div className="reviewer-info">
                            <strong>Phạm Thị D</strong>
                            <p>Giảng viên tại DEF Academy</p>
                            <p>Chuyên gia đào tạo kỹ năng mềm</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MainContent;