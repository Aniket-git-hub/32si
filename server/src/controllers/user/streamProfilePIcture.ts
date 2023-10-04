import { NextFunction, Request, Response } from 'express';
import { gridfsBucket } from '../../dbInitialization';
import CustomError from '../../utils/createError';
import sharp from 'sharp';

async function streamProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const filename = req.params.filename;
    const file = await gridfsBucket.find({ filename: filename }).toArray();
    if (!file || file.length === 0) {
      throw new CustomError('Error404', 'File not found');
    }
    const readStream = gridfsBucket.openDownloadStreamByName(filename);
    const transform = sharp().webp({ lossless: true });
    readStream.pipe(transform).pipe(res);
  } catch (error) {
    next(error);
  }
}

export default streamProfilePicture;
