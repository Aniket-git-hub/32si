import User from '../../models/user.js'
import Otp from '../../models/otp.js'
import sendEmailOtp from '../../utils/sendEmailOtp.js'
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("User doesn't Exist")
        }
        const otp = Math.floor(100000 + Math.random() * 900000)
        const newOtp = new Otp({ email, otp })
        // await newOtp.save()
        //send opt by email
        const sent = await sendEmailOtp(email, newOtp.otp) 
        if (!sent) {
            throw new Error("Something went wrong!")
        }
        //send response
        res.json({
            message: "Otp Sent Successfully",
            email
        })
    } catch (error) {
        console.log(error)
    }
}

export default forgotPassword