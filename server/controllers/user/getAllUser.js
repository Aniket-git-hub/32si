import USER from "../../models/user.js"
import mongoose from 'mongoose';

async function getAllUser(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        let skips = (page - 1) * 10

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
