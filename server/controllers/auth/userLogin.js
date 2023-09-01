import bcrypt from 'bcryptjs'
import User from "../../models/user.js"
import generateToken from "../../utils/generateToken.js"
import createError from '../../utils/createError.js'

/**
 * @description  controller to login the user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {Function} next Next middleware function.
 */
async function login(req, res, next) {
    try {
        const { email, password:pass } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            throw createError("AuthError", "Invalid Email")
        }

        if (!bcrypt.compareSync(pass, user.password)) {
            throw createError("AuthError", "Invalid Password")
        }

        const { accessToken, refreshToken } = generateToken({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
            secure: process.env.NODE_ENV === 'development' ? false : true,
            maxAge: 24 * 60 * 60 * 1000
        })

        const { password, ...rest } = user._doc
        res.status(200).json({
            message: "User logged in successfully",
            accessToken,
            user: rest
        })

    } catch (error) {
        next(error)
    }
}

export default login