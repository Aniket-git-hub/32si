const accountDeletionEmailTemplate = (name: string) => `
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
    <p style="font-size: 18px;">If you're sure about this decision and understand the consequences, please click on the link below to confirm your account deletion:</p>
    <div style="text-align: center; margin-top: 20px;">
        <a href="#" style="background-color: #ff0000; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: .3rem;">Confirm Account Deletion</a>
    </div>
    <p style="font-size: 18px;">If you didn't request this or if you've changed your mind, please disregard this email or contact our support team.</p>
    <p style="font-size: 18px;">Thank you for using our services. We hope to see you again in the future.</p>
    <p style="font-size: 18px;">Best regards,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
</div>`

export default accountDeletionEmailTemplate