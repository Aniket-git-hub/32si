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
        console.log({ receiverEmail, otp})
        let info = await transporter.sendMail({
            from: process.env.MAIL_EMAIL,
            to: receiverEmail,
            subject: 'Hello, OTP here ✔',
            html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h4>Request for OTP ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">Otp: ${otp}</h1>
   </div>
    `,
        });
        return info
    } catch (error) {
        console.log(error);
        return false
    }
}

export default sendEmailOtp