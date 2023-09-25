import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dbConfig from '../config/db.config';
import { NextFunction, Request, Response } from 'express';

const storage = new GridFsStorage({
  url: dbConfig.mongodb_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (_req, file) => {
    const types = ['image/png', 'image/jpeg'];
    if (types.indexOf(file.mimetype) === -1) {
      const fileName = `${Date.now()}_${file.originalname}`;
      return fileName;
    }
    return {
      bucketName: 'profile_Picture',
      filename: `${Date.now()}_${file.originalname}`,
    };
  },
});
const upload = multer({ storage });

function uploadProfilePicture(req: Request, res: Response, next: NextFunction) {
  upload.single('profileImage')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(err);
    } else if (err) {
      next(err);
    }
    next();
  });
}

export default uploadProfilePicture;
