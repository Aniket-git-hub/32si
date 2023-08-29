import USER from '../../models/user.js'
import OTP from '../../models/otp.js'
import sendEmailOtp from '../../utils/sendEmailOtp.js'
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body
        const savedUser = await USER.findOne({ email })
        if (!savedUser) {
            throw new Error("User doesn't Exist")
        }
        const otp = Math.floor(100000 + Math.random() * 900000)
        const newOtp = new OTP({ email, otp })
        await newOtp.save()
        const sent = await sendEmailOtp(email, newOtp.otp) 
        if (!sent) {
            throw new Error("Something went wrong!")
        }

        res.json({
            message: "Otp Sent Successfully",
        })
    } catch (error) {
        console.log(error)
    }
}

export default forgotPassword