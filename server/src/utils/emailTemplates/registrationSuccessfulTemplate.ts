import { getEnvironmentVariable } from '../Helper';

const registrationSuccessfulTemplate = (name: string) => `
    <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
    <!-- <img src="https://example.com/image.jpg" alt="B2 Beads Board Game" style="width: 100%;"> -->
    <h2 style="font-size: 24px;">Welcome to our online multiplayer 32 beads board game!</h2>
    <p style="font-size: 18px;">Hello, ${name}</p>
    <p style="font-size: 18px;">Thank you for registering on our app. We're excited to have you join our community of players.</p>
    <p style="font-size: 18px;">Our game offers a modern twist on the classic game of 32 beads. You can play online with other players or challenge yourself against our AI. With beautiful graphics and smooth gameplay, we're sure you'll have a great time.</p>
    <h3 style="font-size: 20px;">Features:</h3>
    <table style="border-collapse: collapse; width: 100%; font-size: 18px;">
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Online multiplayer</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Play against AI</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Beautiful graphics</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Smooth gameplay</td>
        </tr>
    </table>
    <p style="font-size: 18px;">If you have any questions or feedback, please don't hesitate to contact us. We're always here to help.</p>
    <a href=" ${getEnvironmentVariable(
      'APP_URL',
    )}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; font-size: 18px; border-radius: 5px; cursor:pointer; transition: all 0.2s ease-in-out;" onmouseover="this.style.backgroundColor='#0069D9'" onmouseout="this.style.backgroundColor='#007BFF'">Login</a>
    <p style="font-size: 18px;">Thank you and happy gaming,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
</div>
`;

export default registrationSuccessfulTemplate;
