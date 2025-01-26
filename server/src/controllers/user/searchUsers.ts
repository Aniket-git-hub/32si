import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';

type MatchStage = {
  $match: {
    $text?: { $search: string };
    location?: {
      $nearSphere?: {
        $geometry: {
          type: string;
          coordinates: number[];
        };
        $maxDistance?: number;
      };
    };
  };
};

type ProjectStage = {
  $project: {
    name: 1;
    username: 1;
    profilePhoto: 1;
  };
};

type SkipStage = { $skip: number };
type LimitStage = { $limit: number };
type FacetStage = {
  $facet: {
    metadata: Array<{ $count: string } | { $addFields: { page: number, limit: number } }>;
    data: Array<{ $skip: number } | { $limit: number }>;
  };
};

async function searchUsers(req: Request, res: Response, next: NextFunction) {
  let searchQuery = req.query.q as string;
  let userLocation = [parseFloat(req.query.longitude as string), parseFloat(req.query.latitude as string)];
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;

  let skip = (page - 1) * limit;

  try {
    let pipeline: (MatchStage | ProjectStage | SkipStage | LimitStage | FacetStage)[] = [
      { $match: { $text: { $search: searchQuery } } },
      { $project: { name: 1, username: 1, profilePhoto: 1 } },
    ];

    if (userLocation[0] && userLocation[1]) {
      pipeline.splice(1, 0, {
        $match: {
          location: {
            $nearSphere: {
              $geometry: {
                type: "Point",
                coordinates: userLocation
              },
              $maxDistance: 5000
            }
          }
        }
      });
    }

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: page, limit: limit } }],
        data: [{ $skip: skip }, { $limit: limit }]
      }
    });

    const result = await USER.aggregate(pipeline);

    const users = result[0].data;
    let metadata = { total: 0, page: page, limit: limit };
    if (result[0].metadata[0]) {
      metadata = result[0].metadata[0];
    }
    const hasMore = (metadata.page * metadata.limit) < metadata.total;

    res.status(200).json({
      users,
      total: metadata.total,
      page,
      limit,
      hasMore,
    });

  } catch (err) {
    next(err);
  }
}

export default searchUsers;