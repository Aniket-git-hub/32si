import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';
import { gridfsBucket } from '../../dbInitialization';

async function uploadProfilePictureController(req: Request, res: Response, next: NextFunction) {
  try {
    const { file } = req;
    if (!file) {
      throw new CustomError('Error404', 'Profile picture not found');
    }

    const writeStream = gridfsBucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    writeStream.write(file.buffer);
    writeStream.end();

    if (file.smallBuffer) {
      const smallWriteStream = gridfsBucket.openUploadStream(file.originalname.replace(/(\.[\w\d_-]+)$/i, '_small$1'), {
        contentType: file.mimetype,
      });

      smallWriteStream.write(file.smallBuffer);
      smallWriteStream.end();
    }

    const userId = req.user.id;

    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { profilePhoto: file.originalname },
      { new: true },
    ).populate('friends');

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
