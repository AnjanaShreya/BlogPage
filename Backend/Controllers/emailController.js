const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.YAHOO_EMAIL,
    pass: process.env.YAHOO_APP_PASSWORD
  },
  debug: true
});

const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: `Blog Platform <${process.env.YAHOO_EMAIL}>`,
      to,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message
    });
  }
};

module.exports = { sendEmail };
