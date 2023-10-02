const newFeedbackReceivedTemplate = (adminName: string, userName: string, userEmail: string, userMessage: string) => `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
    <h2 style="font-size: 24px;">New Feedback Received</h2>
    <p style="font-size: 18px;">Hello, ${adminName}</p>
    <p style="font-size: 18px;">We have received new feedback from a user. Here are the details:</p>
    <table style="border-collapse: collapse; width: 100%; font-size: 18px;">
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${userName}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${userEmail}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Message:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${userMessage}</td>
        </tr>
    </table>
    <p style="font-size: 18px;">Please review the feedback and let us know about any necessary actions or responses.</p>
    <p style="font-size: 18px;">Best Regards,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
</div>
`;

export default newFeedbackReceivedTemplate;
