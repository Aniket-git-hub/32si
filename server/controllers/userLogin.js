import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import User from "../models/user.js"

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
            throw new Error("Invalid Email")
        }

        if (!bcrypt.compareSync(pass, user.password)) {
            throw new Error("Invalid password")
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
        
        const { password, ...rest } = user._doc
        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: rest
        })

    } catch (error) {
        next(error)
    }
}

export default login