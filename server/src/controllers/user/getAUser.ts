import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';

/**
 * @description  controller to get a user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAUser(req: Request, res: Response, next: NextFunction) {
  const username: string = req.params.username;
  try {
    const dbUser = await USER.findOne({ username: username }).populate('friends');
    if (!dbUser) throw new CustomError('AuthError', 'user not found');
    const { password, ...rest } = dbUser.toObject();
    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
}

export default getAUser;
