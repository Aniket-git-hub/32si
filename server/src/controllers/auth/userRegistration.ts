import bcrypt from 'bcryptjs'
import User from "../../models/user.js"
import generateToken from "../../utils/generateToken.js"
import { sendRegistrationSuccessfulEmail } from '../../utils/sendEmail.js'
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../utils/createError.js';

interface User {
    name: string;
    username: string;
    email: string;
    password: string;
}

/**
 * @description  controller to register the user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function register(req: Request, res: Response, next: NextFunction) {
    const { name, username, email, password }: User = req.body
    const newUser = new User({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, 12)
    })
    try {
        const savedUser = await newUser.save().populate("friends")

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

        const { password, ...rest } = savedUser.populate("friends").execPopulate()._doc
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
