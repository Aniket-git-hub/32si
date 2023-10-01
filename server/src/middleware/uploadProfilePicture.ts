import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import CustomError from '../utils/createError';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

function uploadProfilePicture(req: Request, res: Response, next: NextFunction) {
  upload.single('profile_Picture')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      next(err);
    } else if (err) {
      next(err);
    }

    if (!req.file) {
      throw new CustomError('Error404', 'No files found');
    }

    if (!req.file.mimetype.startsWith('image/')) {
      throw new CustomError('Error404', 'File must be an image');
    }

    try {
      const image = sharp(req.file.buffer);
      const buffer = await image
        .webp({ quality: 80, nearLossless: true })
        .resize({ width: 500, height: 500 })
        .toBuffer();
      req.file.buffer = buffer;
      req.file.originalname = req.file.originalname.replace(/(\.[\w\d_-]+)$/i, '_comp.webp').replace(/\s/g, '');

      const smallBuffer = await image.resize({ width: 20, height: 20 }).toBuffer();
      req.file.smallBuffer = smallBuffer;
    } catch (error) {
      next(error);
    }

    next();
  });
}

export default uploadProfilePicture;
