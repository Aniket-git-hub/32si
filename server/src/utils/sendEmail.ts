import transporter from "../config/mailer.config"
import otpEmailTemplate from "./emailTemplates/otpEmailTemplate"
import passwordResetInitiatedTemplate from "./emailTemplates/passwordResetInitiatedTemplate"
import passwordResetSuccessfulTemplate from "./emailTemplates/passwordResetSuccessfulTemplate"
import registrationSuccessfulTemplate from "./emailTemplates/registrationSuccessfulTemplate";

interface EmailResponse {
  success: boolean;
  info?: any;
  error?: any;
}

async function sendEmail(receiverEmail: string, subject: string, template: string): Promise<EmailResponse> {
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

export const sendOTPEmail = (receiverEmail: string, name: string, otp: number) => sendEmail(receiverEmail, 'Hello, OTP here', otpEmailTemplate(name, otp))
export const sendPasswordResetInitiatedEmail = (receiverEmail: string, name: string) => sendEmail(receiverEmail, 'Password Reset Initiated', passwordResetInitiatedTemplate(name))
export const sendPasswordResetSuccessfulEmail = (receiverEmail: string, name: string) => sendEmail(receiverEmail, 'Password Reset Successful', passwordResetSuccessfulTemplate(name))
export const sendRegistrationSuccessfulEmail = (receiverEmail: string, name: string) => sendEmail(receiverEmail, 'Welcome to B2 Beads Board Game!', registrationSuccessfulTemplate(name))
