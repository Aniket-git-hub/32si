import { NextFunction, Request, Response } from 'express';
import GAME from '../../models/game';

async function createGame(req: Request, res: Response, next: NextFunction) {
      try {
            const userId = req.user.id
            const game = new GAME({
                  players: [userId]
            })
            const savedGame = await game.save()
            res.json({
                  message: "New game created",
                  game: savedGame
            })
      } catch (error) {
            next(error)
      }
}

export default createGame;
