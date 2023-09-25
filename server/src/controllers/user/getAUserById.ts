import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';

/**
 * @description  controller to get a user by id.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId: string = req.params.userId;
    const dbUser = await USER.findById(userId);
    if (!dbUser) throw new CustomError('AuthError', 'User not found');
    const { password, ...rest } = dbUser.toObject();
    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
}

export default getAUserById;
