import { NextFunction, Request, Response } from 'express';
import { gfs, gridfsBucket } from '../../dbInitialization';
import CustomError from '../../utils/createError';
import mongoose from 'mongoose';

async function streamProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      throw new CustomError('Error404', 'File not found');
    }
    const readStream = gridfsBucket.openDownloadStream(new mongoose.Types.ObjectId(file._id));
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export default streamProfilePicture;
