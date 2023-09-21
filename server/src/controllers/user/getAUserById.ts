import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user'

/**
 * @description  controller to get a user by id.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAUserById(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId
    try {
        const dbUser = await USER.findById(userId)
        if (!dbUser) {
            throw new Error("db user not found")
        }
        const { password, ...rest } = dbUser.toObject()
        res.status(200).json({ user: rest })
    } catch (error) {
        next(error)
    }
}

export default getAUserById
