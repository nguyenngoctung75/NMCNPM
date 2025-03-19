const fs = require('fs');
const path = require('path');
const transporter = require('../config/emailConfig');

const sendEmail = async (to, subject, templateName, context) => {
    try {
        const htmlTemplate = await generateHtmlTemplate(templateName, context);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlTemplate
        };
        await transporter.sendMail(mailOptions);
        console.log('Email đã được gửi thành công!');
    } catch (error) {
        console.error('Lỗi khi gửi email: ', error.message);
        throw new Error('Không thể gửi email');
    }
};

const generateHtmlTemplate = async (templateName, context) => {
    const filePath = path.join(__dirname, '..', 'views', 'emails', `${templateName}.html`);
    let source = fs.readFileSync(filePath, 'utf8');
    
    // Thay thế các placeholder trong template bằng giá trị thực tế
    Object.keys(context).forEach(key => {
        source = source.replace(new RegExp(`{{${key}}}`, 'g'), context[key]);
    });

    return source;
};

module.exports = sendEmail;