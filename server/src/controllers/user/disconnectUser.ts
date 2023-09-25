import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';

async function disconnectUser(req: Request, res: Response, next: NextFunction) {
  try {
    const requestedUserId: string = req.params.userId;
    const currentUserId: string = req.user.id;

    const currentUser = await USER.findOneAndUpdate(
      { _id: currentUserId, friends: requestedUserId },
      { $pull: { friends: requestedUserId } },
      { new: true },
    ).populate('friends');

    const requestedUser = await USER.findOneAndUpdate(
      { _id: requestedUserId, friends: currentUserId },
      { $pull: { friends: currentUserId } },
      { new: true },
    ).populate('friends');

    if (!currentUser || !requestedUser) {
      throw new CustomError('AuthError', 'User not found');
    }

    const { password, ...restCurrentUser } = currentUser.toObject();
    const { password: Rpassword, ...restRequestedUser } = requestedUser.toObject();

    res.json({
      message: 'Disconnected successfully',
      user: restCurrentUser,
      requestedUser: restRequestedUser,
    });
  } catch (error) {
    next(error);
  }
}

export default disconnectUser;
