import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Homely Hub",
      link: "https://homelyhub.vercel.com",
    },
  });

  const emailBody = mailGenerator.generate(options.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  //Nodemailer starts
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.emit.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "<hello@homelyhub.in>",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailBody,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email Failed", error);
  }
};

//factory Functions
const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Homely Hub App! We are sending you the link to reset the password",
      action: {
        instructions: "To reset your password please click here",
        button: {
          color: "#22FF",
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to the email, we would love to help you",
    },
  };
};

export { sendMail, forgotPasswordMailGenContent };
