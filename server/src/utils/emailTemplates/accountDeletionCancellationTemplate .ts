const accountDeletionCancellationTemplate = (name: string) => `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
        <h2 style="font-size: 24px;">Account Deletion Request Cancelled</h2>
        <p style="font-size: 18px;">Dear ${name},</p>
        <p style="font-size: 18px;">We're writing to let you know that your request to delete your account has been successfully cancelled.</p>
        <p style="font-size: 18px;">Your account remains active, and you can continue to use our services as usual.</p>
        <p style="font-size: 18px;">If you have any questions or need further assistance, please feel free to contact us.</p>
        <p style="font-size: 18px;">Thank you for choosing to stay with us.</p>
        <p style="font-size: 18px;">Best regards,</p>
        <p style="font-size: 18px;">Team 32Beads</p>
    </div>
`;

export default accountDeletionCancellationTemplate;
