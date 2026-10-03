import { NextFunction, Request, Response } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import MESSAGE from '../../models/message';

/**
 * GET /user/chat/:userId?before=<ISO date>&limit=<n>
 * Messages between you and another player, oldest first. Marks their messages to you as read.
 */
export async function getChatHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const me = String(req.user.id);
    const other = req.params.userId;
    if (!isValidObjectId(other)) return res.status(400).json({ message: 'Invalid user id' });
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const before = typeof req.query.before === 'string' ? new Date(req.query.before) : null;

    const filter: Record<string, unknown> = {
      $or: [
        { from: me, to: other },
        { from: other, to: me },
      ],
    };
    if (before && !Number.isNaN(before.getTime())) filter.createdAt = { $lt: before };

    const newestFirst = await MESSAGE.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();
    const hasMore = newestFirst.length > limit;
    const messages = newestFirst.slice(0, limit).reverse();

    await MESSAGE.updateMany({ from: other, to: me, readAt: null }, { $set: { readAt: new Date() } });
    res.json({ messages, hasMore });
  } catch (error) {
    next(error);
  }
}

/** GET /user/chat-unread - number of unread messages per sender: { [userId]: count } */
export async function getUnreadCounts(req: Request, res: Response, next: NextFunction) {
  try {
    const me = new Types.ObjectId(String(req.user.id));
    const rows = await MESSAGE.aggregate([
      { $match: { to: me, readAt: null } },
      { $group: { _id: '$from', count: { $sum: 1 } } },
    ]);
    res.json({ unread: Object.fromEntries(rows.map((r) => [String(r._id), r.count])) });
  } catch (error) {
    next(error);
  }
}
