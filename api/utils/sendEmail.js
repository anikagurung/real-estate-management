import nodemailer from 'nodemailer';

const sendEmail = async (recipientEmail, subject, message, sellerEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Use Gmail or another email service
      auth: {
        user: process.env.EMAIL_USER,  // Service account email from environment variables
        pass: process.env.EMAIL_PASS   // Password or app-specific password
      }
    });

    const mailOptions = {
      from: '"Real Estate System" <no-reply@example.com>',  // Replace with service account
      to: recipientEmail,  // Recipient (user) email
      subject: subject,    // Subject line
      text: message,       // Email body
      replyTo: sellerEmail // Set seller's email as reply-to
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
