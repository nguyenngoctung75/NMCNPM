require('dotenv').config();
const nodemailer = require('nodemailer');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test gửi mail
/*const mailOptions = {
    from: process.env.EMAIL_USER,     // Địa chỉ email người gửi
    to: 'dapip55750@evusd.com',       // Địa chỉ email người nhận
    subject: 'Test Email',             // Chủ đề email
    text: 'This is a test email sent using Nodemailer.'  // Nội dung email dạng văn bản
    // Bạn cũng có thể gửi email dạng HTML bằng cách thêm trường 'html'
    // html: '<h1>This is a test email sent using Nodemailer.</h1>'
};

// Gửi email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error while sending email:', error);
    }
    console.log('Email sent successfully:', info.response);
});*/

module.exports = transporter;