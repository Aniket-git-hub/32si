import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user.ts'
import mongoose from 'mongoose';

/**
 * @description  controller to get all users.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
        const page: number = parseInt(req.query.page as string) || 1
        const limit: number = parseInt(req.query.limit as string) || 10
        let skips: number = (page - 1) * 10

        // Get the current user's friends
        const currentUser = await USER.findById(req.user.id);
        const friends = currentUser.friends;

        let pipeline;

        if (currentUser.location && currentUser.location.type === 'Point') {
            pipeline = [
                {
                    $geoNear: {
                        near: currentUser.location,
                        distanceField: "dist.calculated",
                        maxDistance: 100000,
                        spherical: true
                    }
                },
                { $match: { _id: { $nin: [...friends, currentUser._id] } } },
                {
                    $addFields: {
                        friendsCount: { $size: "$friends" },
                        gamesPlayedCount: { $size: "$gamesPlayed" }
                    }
                },
                { $skip: skips },
                { $limit: limit }
            ];
        } else {
            pipeline = [
                { $match: { _id: { $nin: [...friends, currentUser._id] } } },
                {
                    $addFields: {
                        friendsCount: { $size: { $ifNull: ["$friends", []] } },
                        gamesPlayedCount: { $size: { $ifNull: ["$gamesPlayed", []] } }
                    }
                },
                { $sample: { size: limit } },
                { $skip: skips },
                { $limit: limit }
            ];
        }

        let users = await USER.aggregate(pipeline);

        if (users.length === 0 && currentUser.location && currentUser.location.type === 'Point') {
            pipeline = [
                { $match: { _id: { $nin: [...friends, currentUser._id] } } },
                {
                    $addFields: {
                        friendsCount: { $size: { $ifNull: ["$friends", []] } },
                        gamesPlayedCount: { $size: { $ifNull: ["$gamesPlayed", []] } }
                    }
                },
                { $sample: { size: limit } },
                { $skip: skips },
                { $limit: limit }
            ];
            users = await USER.aggregate(pipeline);
        }

        const count = await USER.countDocuments({ _id: { $nin: [...friends, currentUser._id] } });

        res.status(200).json({
            users,
            total: count,
            page,
            limit
        })
    } catch (error) {
        next(error)
    }
}

export default getAllUser
