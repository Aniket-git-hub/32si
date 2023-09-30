import { NextFunction, Request, Response } from 'express';
import { gfs, gridfsBucket } from '../../dbInitialization';
import CustomError from '../../utils/createError';
import USER from '../../models/user';
import mongoose from 'mongoose';
import path from 'path';

async function deleteProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;

    const filename = req.params.filename;
    const file = await gridfsBucket.find({ filename: filename }).toArray();
    if (!file || file.length === 0) {
      throw new CustomError('Error404', 'File not found');
    }
    await gridfsBucket.delete(file[0]._id);

    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const smallFilename = name + '_small' + ext;
    const smallFile = await gridfsBucket.find({ filename: smallFilename }).toArray();
    await gridfsBucket.delete(smallFile[0]._id);

    const updatedUser = await USER.findByIdAndUpdate(userId, { profilePhoto: '' }, { new: true }).populate('friends');
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
