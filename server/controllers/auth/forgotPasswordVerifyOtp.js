import OTP from "../../models/otp.js"

async function forgotPasswordVerifyOtp(req, res, next) {
    try {
        const { otp, email } = req.body
        const savedOtp = await OTP.findOne({ email })
        if (!savedOtp || savedOtp.otp != otp) {
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