import OTP from "../../models/otp.js"
import bcrypt from "bcryptjs"

async function forgotPasswordVerifyOtp(req, res, next) {
    try {
        const { otp, email } = req.body
        const savedOtp = await OTP.findOne({ email })
        if (!savedOtp || !bcrypt.compareSync(String(otp), savedOtp.otp)) {
            let err = new Error("Invalid Otp")
            err.name = "InvalidOTP"
            throw err
        }
        await OTP.deleteOne({ email })     
        res.json({
            message:"OTP verified."
        })
    } catch (error) {
        next(error)
    }
}

export default forgotPasswordVerifyOtp