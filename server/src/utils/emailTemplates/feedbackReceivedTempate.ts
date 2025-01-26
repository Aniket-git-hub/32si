const feedbackReceivedTemplate = (name: string) => `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
        <h2 style="font-size: 24px; margin-bottom: 20px;">🌟 Thank You for Your Feedback, ${name}! 🌟</h2>
        
        <p style="font-size: 18px;">Hello ${name},</p>

        <p style="font-size: 18px;">We wanted to take a moment to express our gratitude for your valuable feedback. Your insights are incredibly important to us and play a pivotal role in shaping our products and services.</p>

        <p style="font-size: 18px;">Every comment and suggestion you provide is carefully considered, and it helps us understand your experiences and expectations better.</p>

        <p style="font-size: 18px;">We're committed to using your feedback to continue improving and delivering exceptional experiences.</p>

        <p style="font-size: 18px;">If you have any further thoughts or experiences you'd like to share, please feel free to reach out to us.</p>

        <p style="font-size: 18px;">As a token of our appreciation, here's a special offer for you: [Discount Code]</p>

        <p style="font-size: 18px;">Stay connected with us:</p>
        <a href="[Facebook Link]"><img src="[Facebook Icon URL]" alt="Facebook" /></a>
        <a href="[Twitter Link]"><img src="[Twitter Icon URL]" alt="Twitter" /></a>
        <a href="[Instagram Link]"><img src="[Instagram Icon URL]" alt="Instagram" /></a>

        <p style="font-size: 18px;">If you have any questions or need further assistance, please don't hesitate to contact us:</p>
        <p style="font-size: 18px;">Email: [Email Address]</p>
        <p style="font-size: 18px;">Phone: [Phone Number]</p>

        <p style="font-size: 18px;">Thank you once again for being a part of our community and for helping us be better.</p>

        <p style="font-size: 18px;">Best Regards,</p>
        <p style="font-size: 18px;">[Your Name]<br>[Your Title]</p>
    </div>
`;

export default feedbackReceivedTemplate;
