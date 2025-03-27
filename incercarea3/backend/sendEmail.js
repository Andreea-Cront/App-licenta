//sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (recipientEmail, orderId) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service
    auth: {
      user: 'your-email@gmail.com', // Your email address
      pass: 'your-email-password', // Your email password (use environment variables in production)
    },
  });

  let mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: 'Order Confirmation',
    text: `Your order has been placed successfully. Your order ID is ${orderId}.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
