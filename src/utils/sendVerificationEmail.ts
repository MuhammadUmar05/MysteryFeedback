import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  username: string,
  email: string,
  verifyCode: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Mystery Feedback" <${process.env.GMAIL_USER}>`,
      to: email, 
      subject: "Verification Code",
      text: `Hello ${username}, your code is ${verifyCode}`,
      html: `<b>Hello ${username}, your code is ${verifyCode}</b>`,
      
    });

    return { success: true, message: "Email sent!" };
  } catch (error) {
    console.error("Nodemailer error:", error);
    return { success: false, message: "Failed to send email" };
  }
};