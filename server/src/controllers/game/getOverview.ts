import { NextFunction, Request, Response } from 'express';
import GAME from '../../models/game';
import { countOnlineUsers, getRooms } from '../../socketIOEventHandlers/gameEventHandler';

/** GET /game/overview - site-wide numbers for the home page. */
async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const totalGames = await GAME.estimatedDocumentCount();
    res.json({ totalGames, onlinePlayers: countOnlineUsers(), activeGames: getRooms().activeGames() });
  } catch (error) {
    next(error);
  }
}

export default getOverview;
