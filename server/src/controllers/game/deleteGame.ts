import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';

async function deleteGame(req: Request, res: Response, next: NextFunction) {
      try {
            const userId = req.user.id;
            const gameLobbyId = req.params.gameLobbyId;

            const user = await USER.findByIdAndUpdate(
                  userId,
                  { $pull: { createdGames: gameLobbyId } },
                  { new: true }
            ).populate('friends');

            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }

            const { password, ...rest } = user.toObject()

            res.json({ message: 'Game deleted successfully', user: rest });

      } catch (error) {
            next(error);
      }
}

export default deleteGame;