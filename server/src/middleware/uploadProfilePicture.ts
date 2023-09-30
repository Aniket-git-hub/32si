import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';

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

    if (req.file) {
      const buffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer();

      req.file.buffer = buffer;
      req.file.originalname = req.file.originalname.replace(/(\.[\w\d_-]+)$/i, '_comp.png').replace(/\s/g, '');

      const smallBuffer = await sharp(req.file.buffer).resize({ width: 20, height: 20 }).png().toBuffer();

      req.file.smallBuffer = smallBuffer;
    }

    next();
  });
}

export default uploadProfilePicture;
