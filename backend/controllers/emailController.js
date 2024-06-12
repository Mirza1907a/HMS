const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "luxurystay10@gmail.com",
    pass: "ctqe fmmr ljmy yvli",
  },
});

// Function to send email
const sendEmail = async (to, subject, text, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: '"Luxury Stay" <luxurystay7@outlook.com>',
      to: to,
      subject: subject,
      text: text,
      html: htmlContent,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
