const otpEmailTemplate = (name: string, otp: number) => `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333;  border: 1px solid #b8b8b8; border-radius:.3rem;">
    <h2 style="font-size: 24px;">Your One-Time Password (OTP)</h2>
    <p style="font-size: 18px;">Hello, ${name}</p>
    <p style="font-size: 18px;">You requested a one-time password to access your account. Here is your OTP:</p>
    <h1 style="font-size: 48px; text-align: center;">${otp}</h1>
    <p style="font-size: 18px;">This OTP is valid for the next 2 minutes. Do not share this OTP with anyone.</p>
    <p style="font-size: 18px;">If you did not request this OTP, please ignore this email or contact support.</p>
    <p style="font-size: 18px;">Thank you,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
  </div>
`;
export default otpEmailTemplate;
