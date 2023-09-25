import { NextFunction, Request, Response } from 'express';
import { gfs, gridfsBucket } from '../../dbInitialization';
import CustomError from '../../utils/createError';
import USER from '../../models/user';

async function deleteProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;

    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) throw new CustomError('Error404', 'Profile picture not found');
    await gridfsBucket.delete(file._id);

    const updatedUser = await USER.findByIdAndUpdate(userId, { profilePicture: '' }, { new: true }).populate('friends');
    if (!updatedUser) throw new CustomError('UserUpdateError', 'Problem updating the user');

    const { password, ...rest } = updatedUser.toObject();

    res.status(200).json({
      message: 'profile picture deleted successfully',
      user: rest,
    });
  } catch (error) {
    next(error);
  }
}

export default deleteProfilePicture;
