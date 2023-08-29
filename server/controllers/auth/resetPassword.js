import USER from '../../models/user.js'
import createError from '../../utils/createError.js'
import bcrypt from 'bcryptjs'
import { sendPasswordResetSuccessfulEmail } from '../../utils/sendEmail.js'
async function resetPassword(req, res, next) {
    const { email, password } = req.body
    try {
        const user = await USER.findOne({ email })
        if (!user) {
            throw createError("AuthError", "Invalid Email")
        }

        const hashPassword = await bcrypt.hash(password, 12)
        user.password = hashPassword
        await user.save()

        const { success, error } = await sendPasswordResetSuccessfulEmail(email)
        if (!success) {
            throw createError("SendingEmail", "Email Not Sent", error)
        }

        res.json({
            message:"Password reset successful"
        })

    } catch (error) {
        next(error)
    }
}

export default resetPassword