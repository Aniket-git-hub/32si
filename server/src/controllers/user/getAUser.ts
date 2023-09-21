import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user.ts'

/**
 * @description  controller to get a user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAUser(req: Request, res: Response, next: NextFunction) {
    const username: string = req.params.username;
    try {
        const dbUser = await USER.findOne({ username: username }).populate("friends")
        const { password, ...rest } = dbUser._doc
        res.status(200).json({ user: rest })
    } catch (error) {
        next(error)
    }
}

export default getAUser
