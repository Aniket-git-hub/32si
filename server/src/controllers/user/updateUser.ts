import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';
/**
 * @description  controller to update a user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, ...otherData } = req.body;
    const savedUser = await USER.findByIdAndUpdate(userId, otherData, {
      new: true,
      runValidators: true,
    }).populate('friends');
    if (!savedUser) throw new CustomError('UserUpdateError', 'Problem updating the user');
    const userObject = savedUser.toObject();
    const { password, ...rest } = userObject;
    res.status(200).json({
      message: 'User updated successfully',
      user: rest,
    });
  } catch (error) {
    next(error);
  }
}

export default updateUser;
