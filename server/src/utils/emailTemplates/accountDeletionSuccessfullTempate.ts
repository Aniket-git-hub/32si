const accountDeletionSuccessTemplate = (name: string) => `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
        <h2 style="font-size: 24px;">Account Deletion Successful</h2>
        <p style="font-size: 18px;">Dear ${name},</p>
        <p style="font-size: 18px;">We wanted to inform you that your account has been successfully deleted.</p>
        <p style="font-size: 18px;">If you ever decide to return, we'll be more than happy to welcome you back.</p>
        <p style="font-size: 18px;">Thank you for being a part of our community.</p>
        <p style="font-size: 18px;">Best regards,</p>
        <p style="font-size: 18px;">Team 32Beads</p>
    </div>
`;

export default accountDeletionSuccessTemplate;
