import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { SavedGame, summarize, toHistory } from '../../game/stats';
import GAME from '../../models/game';
import USER from '../../models/user';

const MAX_GAMES = 1000;

/**
 * GET /game/stats?userId=<id>&limit=<n>
 * Win/loss record, streaks, head-to-head and the most recent games of a player (default: you).
 */
async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = typeof req.query.userId === 'string' && req.query.userId ? req.query.userId : String(req.user.id);
    if (!isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid user id' });
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const games = await GAME.find({ players: userId }).sort({ endTime: -1 }).limit(MAX_GAMES).lean();

    // Look players up separately: populate() drops deleted users from the array, which would shift
    // players[0] (RED) / players[1] (BLUE).
    const ids = [...new Set(games.flatMap((g) => g.players.map(String)))];
    const users = await USER.find({ _id: { $in: ids } })
      .select('username name profilePhoto')
      .lean();
    const byId = new Map(users.map((u) => [String(u._id), { ...u, _id: String(u._id) }]));
    const withPlayers = games.map((g) => ({
      ...g,
      _id: String(g._id),
      players: g.players.map((p) => byId.get(String(p)) ?? { _id: String(p), username: 'Deleted player' }),
    }));

    const history = toHistory(withPlayers as unknown as SavedGame[], userId);
    res.json({ stats: summarize(history), history: history.slice(0, limit) });
  } catch (error) {
    next(error);
  }
}

export default getStats;
