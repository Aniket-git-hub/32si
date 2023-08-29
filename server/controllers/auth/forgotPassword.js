import USER from '../../models/user.js'
import OTP from '../../models/otp.js'
import createError from '../../utils/createError.js'
import { sendOTPEmail, sendPasswordResetInitiatedEmail } from '../../utils/sendEmail.js'

async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body

        const savedUser = await USER.findOne({ email })
        if (!savedUser) {
            throw createError("AuthError", "Invalid Email")
        }

        const { success: initSuccess, error: initError } = await sendPasswordResetInitiatedEmail(email)
        if (!initSuccess) {
            throw createError("SendingEmail", "Email Not Sent", initError)
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        const newOtp = new OTP({ email, otp })
        await newOtp.save()

        const { success: otpSuccess, error: otpError } = await sendOTPEmail(email, newOtp.otp)
        if (!otpSuccess) {
            throw createError("SendingEmail", "Email Not Sent", otpError)
        }

        res.json({
            message: "Otp Sent Successfully",
        })

    } catch (error) {
        next(error)
    }
}

export default forgotPassword
