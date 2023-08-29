import USER from '../../models/user.js'
import OTP from '../../models/otp.js'
import sendEmailOtp from '../../utils/sendEmailOtp.js'
import createError from '../../utils/createError.js'
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body
        
        const savedUser = await USER.findOne({ email })
        if (!savedUser) {
            throw createError("AuthError", "Invalid Email")
        }
        const otp = Math.floor(100000 + Math.random() * 900000)
        const newOtp = new OTP({ email, otp })
        await newOtp.save()
        
        const { success, error } = await sendEmailOtp(email, newOtp.otp) 
        if (!success) {
            throw createError("SendingEmail", "Email Not Sent", error)
        }

        res.json({
            message: "Otp Sent Successfully",
        })
    
    } catch (error) {
        next(error)
    }
}

export default forgotPassword