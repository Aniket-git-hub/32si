import bcrypt from 'bcryptjs'
import User from "../../models/user.js"
import generateToken from "../../utils/generateToken.js"

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
            let err = new Error("Invalid email")
            err.name = "LoginError"
            throw err
        }

        if (!bcrypt.compareSync(pass, user.password)) {
            let err = new Error("Invalid password")
            err.name = "LoginError"
            throw err
        }

        const { accessToken, refreshToken } = generateToken({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            // secure: true,
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