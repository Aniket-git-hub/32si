import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';

async function uploadProfilePictureController(req: Request, res: Response, next: NextFunction) {
  try {
    const { file } = req;
    if (!file) {
      throw new CustomError('Error404', 'Profile picture not found');
    }
    const userId = req.user.id;
    const updatedUser = await USER.findByIdAndUpdate(userId, { profilePhoto: file.filename }, { new: true }).populate(
      'friends',
    );
    if (!updatedUser) throw new CustomError('UserUpdateError', 'Problem updating the user');

    const { password, ...rest } = updatedUser.toObject();

    res.status(200).json({
      message: 'profile picture uploaded successfully',
      user: rest,
    });
  } catch (error) {
    next(error);
  }
}

export default uploadProfilePictureController;
