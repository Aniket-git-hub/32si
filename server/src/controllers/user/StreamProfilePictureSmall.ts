import { NextFunction, Request, Response } from 'express';
import { gridfsBucket } from '../../dbInitialization';
import CustomError from '../../utils/createError';
import path from 'path';

async function StreamProfilePictureSmall(req: Request, res: Response, next: NextFunction) {
  try {
    const filename = req.params.filename;
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const newFilename = name + '_small' + ext;
    const file = await gridfsBucket.find({ filename: newFilename }).toArray();
    if (!file || file.length === 0) {
      throw new CustomError('Error404', 'File not found');
    }
    const readStream = gridfsBucket.openDownloadStreamByName(newFilename);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export default StreamProfilePictureSmall;
