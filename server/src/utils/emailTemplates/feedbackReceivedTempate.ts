const feedbackReceivedTemplate = (name: string) => `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
    <h2 style="font-size: 24px;">Thank You for Your Feedback!</h2>
    <p style="font-size: 18px;">Hello, ${name}</p>
    <p style="font-size: 18px;">Thank you for taking the time to provide us with your valuable feedback. We appreciate your effort and want to assure you that each and every comment is read and taken into consideration.</p>
    <p style="font-size: 18px;">Your feedback helps us understand your experiences and expectations, which in turn assists us in providing better services and products.</p>
    <p style="font-size: 18px;">We value your input and encourage you to let us know more about your experiences with our company.</p>
    <p style="font-size: 18px;">Thank you once again for your valuable feedback.</p>
    <p style="font-size: 18px;">Best Regards,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
</div>
`;

export default feedbackReceivedTemplate;
