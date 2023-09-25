import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';

async function connectUser(req: Request, res: Response, next: NextFunction) {
  try {
    const requestedUsername: string = req.params.username;
    const currentUser = req.user;

    const requestedUser = await USER.findOneAndUpdate(
      { username: requestedUsername, connectionRequests: { $ne: currentUser.username } },
      { $addToSet: { connectionRequests: currentUser.username } },
      { new: true },
    );

    if (!requestedUser) {
      throw new Error('User not found or a connection request has already been sent');
    }

    const { password, ...restRequestedUser } = requestedUser.toObject();

    res.json({
      requestedUser: restRequestedUser,
      message: 'Connection request sent',
    });
  } catch (error) {
    next(error);
  }
}

export default connectUser;
