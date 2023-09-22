import bcrypt from 'bcryptjs'
import USER from "../../models/user"
import generateToken from "../../utils/generateToken"
import { sendRegistrationSuccessfulEmail } from '../../utils/sendEmail'
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../utils/createError';

/**
 * @description  controller to register the user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function register(req: Request, res: Response, next: NextFunction) {
    try {

        const { name, username, email, password: pass } = req.body
        const newUser = new USER({
            name,
            username,
            email,
            password: bcrypt.hashSync(pass, 12)
        })

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
            throw new CustomError("SendingEmail", "Email Not Sent", error as Error)
        }

        const populatedUser = await USER.findById(savedUser._id).populate('friends');
        if (!populatedUser) {
            throw new CustomError("RegistrationError", "populated user not found")
        }

        const { password, ...rest } = populatedUser.toObject();
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
