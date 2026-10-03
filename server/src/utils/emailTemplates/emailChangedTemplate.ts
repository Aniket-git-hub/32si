const emailChangedTemplate = (name: string, newEmail: string) => `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; border: 1px solid #b8b8b8; border-radius:.3rem;">
    <h2 style="font-size: 24px;">Your email address was changed</h2>
    <p style="font-size: 18px;">Hello, ${name}</p>
    <p style="font-size: 18px;">The email address on your 32 Beads account was changed to <b>${newEmail}</b>. From now on, sign in and receive emails at that address.</p>
    <p style="font-size: 18px;">If you didn't make this change, reply to this email straight away so we can secure your account.</p>
    <p style="font-size: 18px;">Thank you,</p>
    <p style="font-size: 18px;">Team 32Beads</p>
  </div>
`;
export default emailChangedTemplate;
