import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';

/**
 * GET /game/leaderboard?limit=<n>
 * Top players by rating (only players with at least one rated game), plus your own rank.
 */
async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const ranked = { ratedGames: { $gt: 0 } };
    const top = await USER.find(ranked)
      .sort({ rating: -1, ratedGames: -1 })
      .limit(limit)
      .select('username name profilePhoto rating ratedGames peakRating')
      .lean();

    const me = await USER.findById(req.user.id).select('username rating ratedGames peakRating').lean();
    let myRank: number | null = null;
    if (me && (me.ratedGames ?? 0) > 0) {
      myRank = (await USER.countDocuments({ ...ranked, rating: { $gt: me.rating } })) + 1;
    }
    res.json({
      players: top.map((p, i) => ({ ...p, rank: i + 1 })),
      me: me ? { ...me, rank: myRank } : null,
    });
  } catch (error) {
    next(error);
  }
}

export default getLeaderboard;
