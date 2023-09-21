import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user'
import CustomError from '../../utils/createError';
import mongoose, { ObjectId, Types } from 'mongoose';

/**
 * @description  controller to disconnect a user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function disconnectUser(req: Request, res: Response, next: NextFunction) {
    try {
        const requestedUserId: string = req.params.userId
        const currentUserId: string = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(new Types.ObjectId(currentUserId)),
            USER.findById(new Types.ObjectId(requestedUserId))
        ])

        if (!currentUser || !requestedUser) {
            throw new CustomError("UserError", "user not found")
        }

        const id = new mongoose.Schema.Types.ObjectId(requestedUserId);
        if (!currentUser.friends.includes(id)) {
            throw new Error("You are not friends with this user")
        }

        currentUser.friends = currentUser.friends.filter(id => id.toString() !== requestedUserId)
        requestedUser.friends = requestedUser.friends.filter(id => id.toString() !== currentUserId)

        const [savedCurrentUser, savedRequestedUser] = await Promise.all([
            currentUser.save(),
            requestedUser.save()
        ])

        let populatedCurrentUser = await USER.findById(savedCurrentUser._id).populate('friends')

        if (!populatedCurrentUser) throw new Error("populated current user is wrong")
        const { password, ...restCurrentUser } = populatedCurrentUser.toObject()
        const { password: Rpassword, ...restRequestedUser } = requestedUser.toObject()

        res.json({
            user: restCurrentUser,
            requestedUser: restRequestedUser,
            message: 'Disconnected successfully'
        })

    } catch (error) {
        next(error)
    }
}

export default disconnectUser
