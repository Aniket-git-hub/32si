import USER from '../../models/user.js'

async function acceptConnection(req, res, next) {
    try {
        const requestedUserId = req.params.userId
        const currentUserId = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(currentUserId),
            USER.findById(requestedUserId)
        ])

        if (currentUser.friends.includes(requestedUserId) || !requestedUser.connectionRequests.includes(currentUserId)) {
            throw new Error("You are already friends or a connection request has not been sent")
        }

        const index = requestedUser.connectionRequests.indexOf(currentUserId)
        if (index > -1) {
            requestedUser.connectionRequests.splice(index, 1)
        }

        currentUser.friends.push(requestedUser)
        requestedUser.friends.push(currentUserId)

        const [savedCurrentUser, savedRequestedUser] = await Promise.all([
            currentUser.save(),
            requestedUser.save()
        ])

        let populatedCurrentUser = await USER.findById(savedCurrentUser._id).populate('friends')
        let populatedRequestedUser = await USER.findById(savedRequestedUser._id)

        const { password, ...restCurrentUser } = populatedCurrentUser._doc
        const { password: Rpassword, ...restRequestedUser } = populatedRequestedUser._doc

        res.json({
            message: 'Connected successfully',
            user: restCurrentUser,
            requestedUser: restRequestedUser
        })

    } catch (error) {
        next(error)
    }
}

export default acceptConnection
