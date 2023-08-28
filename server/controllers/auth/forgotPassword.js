import User from '../../models/user.js'
import Otp from '../../models/otp.js'
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        const otp = Math.floor(100000 + Math.random() * 900000)
        const newOtp = new Otp({ email, otp })
        await newOtp.save()
        //send opt by email
        
        //send response
        res.json({user:{email}, otp})
    } catch (error) {
        res.send(error)
    }
}

export default forgotPassword