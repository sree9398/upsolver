// config/nodemailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: "cseaiml65@gmail.com", // Your email address
    pass: "wcjyayrkhvbulwvo"  // Your email password or app-specific password
  }
});

module.exports = transporter;
