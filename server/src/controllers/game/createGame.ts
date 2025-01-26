import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import generateUniqueLobbyId from '../../utils/generateUniqueLobbyId';

async function createGame(req: Request, res: Response, next: NextFunction) {
      try {
            const userId = req.user.id;
            const gameLobbyId = generateUniqueLobbyId();

            const user = await USER.findByIdAndUpdate(
                  userId,
                  { $addToSet: { createdGames: gameLobbyId } },
                  { new: true, runValidators: true }
            ).populate('friends');

            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }
            const { password, ...rest } = user.toObject()

            res.json({ message: 'Game created successfully', user: rest, gameLobbyId });

      } catch (error) {
            next(error);
      }
}

export default createGame;
