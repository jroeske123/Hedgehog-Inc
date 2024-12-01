
// Load environment variables from the .env file
require('dotenv').config();

// Import the nodemailer package
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can change this to another email service provider if needed
  auth: {
    user: process.env.EMAIL_USER,  // Use the EMAIL_USER from the .env file
    pass: process.env.EMAIL_PASS,  // Use the EMAIL_PASS from the .env file
  },
});

// Send the email
const sendEmail = (name, email, subject, message) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,   // Sender address (from the environment variable)
      to: process.env.EMAIL_USER,  // Recipient's email address
      subject: "Contact Page",           // Subject line
      text: `Name: ${name} \nEmail: ${email} \nSubject: ${subject} \nMessage: ${message}`,  // Plain text body
    };
  
    return transporter.sendMail(mailOptions);
  };
module.exports = sendEmail;
