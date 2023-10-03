import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import mongoose from 'mongoose';
import CustomError from '../../utils/createError';

async function acceptConnection(req: Request, res: Response, next: NextFunction) {
  try {
    const requestedUserId: string = req.params.userId;
    const currentUserId: string = req.user.id;

    const requestedUser = await USER.findById(requestedUserId);
    if (!requestedUser) {
      throw new CustomError('AuthError', 'User not found');
    }

    const currentUser = await USER.findOneAndUpdate(
      { _id: currentUserId, connectionRequests: requestedUser.username },
      {
        $pull: { connectionRequests: requestedUser.username },
        $addToSet: { friends: requestedUserId },
      },
      { new: true },
    ).populate('friends');

    const updatedRequestedUser = await USER.findOneAndUpdate(
      { _id: requestedUserId },
      { $addToSet: { friends: currentUserId } },
      { new: true },
    ).populate('friends');

    if (!currentUser || !updatedRequestedUser) {
      throw new CustomError('AuthError', 'User not found');
    }

    const { password, ...restCurrentUser } = currentUser.toObject();
    const { password: Rpassword, ...restRequestedUser } = updatedRequestedUser.toObject();

    res.json({
      message: 'Connected successfully',
      user: restCurrentUser,
      requestedUser: restRequestedUser,
    });
  } catch (error) {
    next(error);
  }
}

export default acceptConnection;
