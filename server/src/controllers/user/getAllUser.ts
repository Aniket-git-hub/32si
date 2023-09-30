import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';

function createPipeline(currentUser: any, friends: any[], limit: number, skips: number, geoNear: boolean) {
  const pipeline: any[] = [];

  if (geoNear) {
    pipeline.push(
      {
        $geoNear: {
          near: currentUser.location,
          distanceField: 'dist.calculated',
          maxDistance: 100000,
          spherical: true,
        },
      },
      { $match: { _id: { $nin: [...friends, currentUser._id] } } },
      {
        $addFields: {
          friendsCount: { $size: '$friends' },
          gamesPlayedCount: { $size: '$gamesPlayed' },
        },
      },
      { $project: { password: 0, friends: 0, connectionRequests: 0, gamesPlayed: 0 } },
      { $skip: skips },
      { $limit: limit },
    );
  } else {
    pipeline.push(
      { $match: { _id: { $nin: [...friends, currentUser._id] } } },
      {
        $addFields: {
          friendsCount: { $size: { $ifNull: ['$friends', []] } },
          gamesPlayedCount: { $size: { $ifNull: ['$gamesPlayed', []] } },
        },
      },
      { $project: { password: 0, friends: 0, connectionRequests: 0, gamesPlayed: 0 } },
      { $skip: skips },
      { $limit: limit },
    );
  }

  return pipeline;
}

/**
 * @description  controller to get all users.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAllUser(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skips = (page - 1) * limit;

    const currentUser = await USER.findById(req.user.id);
    if (!currentUser) throw new Error('currentUser not found');
    const friends = currentUser.friends;

    let geoNear = false;
    if (currentUser.location && currentUser.location.type === 'Point') {
      geoNear = true;
    }

    let pipeline = createPipeline(currentUser, friends, limit, skips, geoNear);
    let users = await USER.aggregate(pipeline);

    let hasMore = users.length === limit;

    if (users.length === 0 && geoNear) {
      pipeline = createPipeline(currentUser, friends, limit, skips, false);
      users = await USER.aggregate(pipeline);
      hasMore = users.length === limit;
    }

    const count = await USER.countDocuments({ _id: { $nin: [...friends, currentUser._id] } });

    res.status(200).json({
      users,
      total: count,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    next(error);
  }
}

export default getAllUser;
