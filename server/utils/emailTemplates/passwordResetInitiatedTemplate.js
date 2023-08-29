const passwordResetInitiatedTemplate = () => `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
    <h2 style="font-size: 24px;">Password Reset Initiated</h2>
    <p style="font-size: 18px;">Hello,</p>
    <p style="font-size: 18px;">We received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using the link below.</p>
    <a href="#" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none;">Reset Password</a>
    <p style="font-size: 18px;">Thank you,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
  </div>`

export default passwordResetInitiatedTemplate