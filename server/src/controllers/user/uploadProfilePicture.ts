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
    await USER.findByIdAndUpdate(userId, { profilePhoto: file.filename });
    res.json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    next(error);
  }
}

export default uploadProfilePictureController;
