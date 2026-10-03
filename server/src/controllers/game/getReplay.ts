import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import GAME from '../../models/game';
import USER from '../../models/user';

/** GET /game/replay/:gameId - everything needed to replay a finished online game. */
async function getReplay(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;
    if (!isValidObjectId(gameId)) return res.status(404).json({ message: 'Game not found' });
    const game = await GAME.findById(gameId).lean();
    if (!game || !game.history?.length) return res.status(404).json({ message: 'No replay for this game' });

    const ids = game.players.map(String);
    const users = await USER.find({ _id: { $in: ids } })
      .select('username name profilePhoto')
      .lean();
    const player = (id: string) => {
      const u = users.find((x) => String(x._id) === id);
      return u
        ? { _id: id, username: u.username, name: u.name, profilePhoto: u.profilePhoto }
        : { _id: id, username: 'Deleted player' };
    };
    res.json({
      id: String(game._id),
      red: player(ids[0]),
      blue: player(ids[1]),
      result: game.result,
      reason: game.reason,
      history: game.history,
      ratingChanges: game.ratingChanges ?? null,
      endTime: game.endTime,
    });
  } catch (error) {
    next(error);
  }
}

export default getReplay;
