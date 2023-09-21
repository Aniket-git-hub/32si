import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user'
import mongoose from 'mongoose';

/**
 * @description  controller to accept a connection request.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function acceptConnection(req: Request, res: Response, next: NextFunction) {
    try {
        const requestedUserId: string = req.params.userId
        const currentUserId: string = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(currentUserId),
            USER.findById(requestedUserId)
        ])

        if (!requestedUser || !currentUser) {
            throw new Error("user not found")
        }

        if (!currentUser.connectionRequests.includes(requestedUser.username)) {
            throw new Error("You are already friends or a connection request has not been sent")
        }

        const index: number = currentUser.connectionRequests.indexOf(requestedUser.username)
        if (index > -1) {
            currentUser.connectionRequests.splice(index, 1)
        }

        currentUser.friends.push(requestedUser._id)
        const id = new mongoose.Schema.Types.ObjectId(currentUserId)
        requestedUser.friends.push(id)

        const [savedCurrentUser, savedRequestedUser] = await Promise.all([
            currentUser.save(),
            requestedUser.save()
        ])

        let populatedCurrentUser = await USER.findById(savedCurrentUser._id).populate('friends')
        let populatedRequestedUser = await USER.findById(savedRequestedUser._id).populate('friends')

        if (populatedCurrentUser && populatedRequestedUser) {
            const { password, ...restCurrentUser } = populatedCurrentUser?.toObject()
            const { password: Rpassword, ...restRequestedUser } = populatedRequestedUser?.toObject()

            res.json({
                message: 'Connected successfully',
                user: restCurrentUser,
                requestedUser: restRequestedUser
            })
        }
    } catch (error) {
        next(error)
    }
}

export default acceptConnection
