import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user'

/**
 * @description  controller to get a user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAUser(req: Request, res: Response, next: NextFunction) {
    const username: string = req.params.username;
    try {
        const dbUser = await USER.findOne({ username: username }).populate("friends");
        if (!dbUser) throw new Error("dbUser not found");
        const userObject = dbUser.toObject();
        const { password, ...rest } = userObject;
        res.status(200).json({ user: rest });

    } catch (error) {
        next(error)
    }
}

export default getAUser
