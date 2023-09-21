import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user'
import { ObjectId } from 'mongoose';

/**
 * @description  controller to connect a user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function connectUser(req: Request, res: Response, next: NextFunction) {
    try {
        const requestedUsername: string = req.params.username
        const currentUserId: string = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(currentUserId),
            USER.findOne({ username: requestedUsername })
        ])

        if (!requestedUser || !currentUser) {
            throw new Error(" user not found")
        }

        const requestedUserId: ObjectId = requestedUser._id

        if (currentUser.friends.includes(requestedUserId) || requestedUser.connectionRequests.includes(currentUser.username)) {
            throw new Error("You are already friends or a connection request has already been sent")
        }

        requestedUser.connectionRequests.push(currentUser.username)

        const savedRequestedUser = await requestedUser.save()
        const { password: Rpassword, ...restRequestedUser } = savedRequestedUser.toObject()

        res.json({
            requestedUser: restRequestedUser,
            message: 'Connection request sent'
        })

    } catch (error) {
        next(error)
    }
}

export default connectUser
