import bcrypt from 'bcryptjs'
import User from "../../models/user.js"
import generateToken from "../../utils/generateToken.js"
import { sendRegistrationSuccessfulEmail } from '../../utils/sendEmail.js'

/**
 * @description  controller to register the user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {Function} next Next middleware function.
 */
async function register(req, res, next) {
    const { name, username, email, password } = req.body
    const newUser = new User({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, 12)
    })
    try {
        const savedUser = await newUser.save()

        const { accessToken, refreshToken } = generateToken({
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            username: savedUser.username
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 24 * 60 * 60 * 1000,
            domain: process.env.NODE_ENV === 'production' ? process.env.ORIGIN_2 : 'localhost',
            path: "/",
        })

        const { success, error } = await sendRegistrationSuccessfulEmail(savedUser.email, savedUser.name)
        if (!success) {
            throw createError("SendingEmail", "Email Not Sent", error)
        }

        const { password, ...rest } = savedUser._doc
        res.status(201).json({
            message: "New User Created Successfully",
            accessToken,
            user: rest
        })
        
    } catch (error) {
        next(error)
    }
}

export default register