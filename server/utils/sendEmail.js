import transporter from "../config/mailer.config.js"
import otpEmailTemplate from "./emailTemplates/otpEmailTemplate.js"
import passwordResetInitiatedTemplate from "./emailTemplates/passwordResetInitiatedTemplate.js"
import passwordResetSuccessfulTemplate from "./emailTemplates/passwordResetSuccessfulTemplate.js"
import registrationSuccessfulTemplate from "./emailTemplates/registrationSuccessfulTemplate.js";

async function sendEmail(receiverEmail, subject, template) {
  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_EMAIL,
      to: receiverEmail,
      subject,
      html: template,
    });
    return { success: true, info }
  } catch (error) {
    return { success: false, error }
  }
}

export const sendOTPEmail = (receiverEmail, name, otp) => sendEmail(receiverEmail, 'Hello, OTP here', otpEmailTemplate(name, otp))
export const sendPasswordResetInitiatedEmail = (receiverEmail, name) => sendEmail(receiverEmail, 'Password Reset Initiated', passwordResetInitiatedTemplate(name))
export const sendPasswordResetSuccessfulEmail = (receiverEmail, name) => sendEmail(receiverEmail, 'Password Reset Successful', passwordResetSuccessfulTemplate(name))
export const sendRegistrationSuccessfulEmail = (receiverEmail, name) => sendEmail(receiverEmail, 'Welcome to B2 Beads Board Game!', registrationSuccessfulTemplate(name))