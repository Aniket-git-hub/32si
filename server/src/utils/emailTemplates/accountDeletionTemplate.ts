const accountDeletionEmailTemplate = (name: string, confirmationLink: string, otp: number, cancellationLink: string) => `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
    <h2 style="font-size: 24px;">Account Deletion Request</h2>
    <p style="font-size: 18px;">Dear ${name},</p>
    <p style="font-size: 18px;">We have received your request to delete your account. We're sorry to see you go and we want to let you know that we value your time with us.</p>
    <p style="font-size: 18px;">Before we proceed with the deletion, we want to make sure you understand what this means:</p>
    <ul style="font-size: 18px;">
        <li>All your personal data will be permanently deleted and cannot be recovered.</li>
        <li>You will lose access to all services associated with your account.</li>
        <li>If you have any active subscriptions, they will be cancelled.</li>
    </ul>
    <p style="font-size: 18px;">To initiate the account deletion process, please click on the link below:</p>
    <div style="text-align: center; margin-top: 20px;">
        <a href="${confirmationLink}" style="background-color: #ff0000; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: .3rem;">Confirm Account Deletion</a>
    </div>
    <p style="font-size: 18px;">Once you click the button, you will be directed to a page where you will need to enter the OTP provided below:</p>
    <h3 style="font-size: 48px; text-align: center;">${otp}</h3>
    <p style="font-size: 18px;">If you didn't request this or if you've changed your mind, please click on the link below to cancel the account deletion:</p>
    <div style="text-align: center; margin-top: 20px;">
        <a href="${cancellationLink}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: .3rem;">Cancel Account Deletion</a>
    </div>
    <p style="font-size: 18px;">If you didn't request this or if you've changed your mind, please disregard this email or contact our support team.</p>
    <p style="font-size: 18px;">Thank you for using our services. We hope to see you again in the future.</p>
    <p style="font-size: 18px;">Best regards,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
</div>`;

export default accountDeletionEmailTemplate;
