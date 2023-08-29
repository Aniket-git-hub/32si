import transporter from "../config/mailer.config.js"
import otpEmailTemplate from "./emailTemplates/otpEmailTemplate.js"
import passwordResetInitiatedTemplate from "./emailTemplates/passwordResetInitiatedTemplate.js"
import passwordResetSuccessfulTemplate from "./emailTemplates/passwordResetSuccessfulTemplate.js"

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

export const sendOTPEmail = (receiverEmail, otp) => sendEmail(receiverEmail, 'Hello, OTP here', otpEmailTemplate(otp))
export const sendPasswordResetInitiatedEmail = (receiverEmail) => sendEmail(receiverEmail, 'Password Reset Initiated', passwordResetInitiatedTemplate())
export const sendPasswordResetSuccessfulEmail = (receiverEmail) => sendEmail(receiverEmail, 'Password Reset Successful', passwordResetSuccessfulTemplate())
