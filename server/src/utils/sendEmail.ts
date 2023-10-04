import SMTPTransport from 'nodemailer/lib/smtp-transport';
import transporter from '../config/mailer.config';
import accountDeletionEmailTemplate from './emailTemplates/accountDeletionTemplate';
import otpEmailTemplate from './emailTemplates/otpEmailTemplate';
import passwordResetInitiatedTemplate from './emailTemplates/passwordResetInitiatedTemplate';
import passwordResetSuccessfulTemplate from './emailTemplates/passwordResetSuccessfulTemplate';
import registrationSuccessfulTemplate from './emailTemplates/registrationSuccessfulTemplate';
import feedbackReceivedTemplate from './emailTemplates/feedbackReceivedTempate';
import newFeedbackReceivedTemplate from './emailTemplates/newFeedbackReceivedTemplate';
import accountDeletionSuccessTemplate from './emailTemplates/accountDeletionSuccessfullTempate';
import accountDeletionCancellationTemplate from './emailTemplates/accountDeletionCancellationTemplate ';

interface EmailResponse {
  success: boolean;
  info?: SMTPTransport.SentMessageInfo;
  error?: Error;
}

async function sendEmail(receiverEmail: string, subject: string, template: string): Promise<EmailResponse> {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_EMAIL,
      to: receiverEmail,
      subject,
      html: template,
    });
    return { success: true, info };
  } catch (error: unknown) {
    return { success: false, error: error as Error };
  }
}

export const sendOTPEmail = (receiverEmail: string, name: string, otp: number) =>
  sendEmail(receiverEmail, 'Hello, OTP here', otpEmailTemplate(name, otp));

export const sendPasswordResetInitiatedEmail = (receiverEmail: string, name: string) =>
  sendEmail(receiverEmail, 'Password Reset Initiated', passwordResetInitiatedTemplate(name));

export const sendPasswordResetSuccessfulEmail = (receiverEmail: string, name: string) =>
  sendEmail(receiverEmail, 'Password Reset Successful', passwordResetSuccessfulTemplate(name));

export const sendRegistrationSuccessfulEmail = (receiverEmail: string, name: string) =>
  sendEmail(receiverEmail, 'Welcome to B2 Beads Board Game!', registrationSuccessfulTemplate(name));

export const sendAccountDeletionEmail = (receiverEmail: string, name: string, confirmationLink: string, otp: number, cancellationLink: string) =>
  sendEmail(receiverEmail, 'Your Account Deletion Request', accountDeletionEmailTemplate(name, confirmationLink, otp, cancellationLink));

export const sendAccountDeletionSuccesfullEmail = (receiverEmail: string, name: string) =>
  sendEmail(receiverEmail, 'Your Account Deleted Succesfully', accountDeletionSuccessTemplate(name));

export const sendAccountDeletionCancellationEmail = (receiverEmail: string, name: string) =>
  sendEmail(receiverEmail, 'Account Deletion Request Cancelled', accountDeletionCancellationTemplate(name));

export const sendFeedbackReceivedEmail = (receiverEmail: string, name: string) =>
  sendEmail(receiverEmail, 'Thank You for Your Valuable Feedback!', feedbackReceivedTemplate(name));

export const sendNewFeedbackReceivedEmail = (
  receiverEmail: string,
  userName: string,
  userMessage: string,
  userEmail: string,
) =>
  sendEmail(
    receiverEmail,
    'New User Feedback Received',
    newFeedbackReceivedTemplate('Aniket Singh', userName, userEmail, userMessage),
  );
