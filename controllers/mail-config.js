const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kh.s.k.rohan@gmail.com', // Your email
    pass: '',   // Your email password or an app-specific password
  },
});

module.exports = transporter;
