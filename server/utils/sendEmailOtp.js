import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
})

async function sendEmailOtp(receiverEmail, otp) {
    try {
        let info = await transporter.sendMail({
            from: process.env.MAIL_EMAIL,
            to: receiverEmail,
            subject: 'Hello, OTP here ✔',
            html: `
      <div
        class="container"
        style="
          max-width: 90%;
          margin: auto;
          padding-top: 20px;
          font-family: Arial, sans-serif;
          color: #333;
        "
      >
        <h4 style="font-size: 20px;">Request for OTP ✔</h4>
        <p style="margin-bottom: 30px; font-size: 16px;">
          Please enter the sign up OTP to get started.
        </p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">
          Otp: ${otp}
        </h1>
      </div>
    `,
        });
        return { success: true, info }
    } catch (error) {
        return { success: false, error }
    }
}

export default sendEmailOtp
