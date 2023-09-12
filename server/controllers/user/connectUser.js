import USER from '../../models/user.js'

async function connectUser(req, res, next) {
    try {
        const requestedUserId = req.params.userId
        const currentUserId = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(currentUserId),
            USER.findById(requestedUserId)
        ])

        if (currentUser.friends.includes(requestedUserId) || requestedUser.connectionRequests.includes(currentUserId)) {
            throw new Error("You are already friends or a connection request has already been sent")
        }

        requestedUser.connectionRequests.push(currentUserId)

        const savedRequestedUser = await requestedUser.save()
        const { password: Rpassword, ...restRequestedUser } = savedRequestedUser._doc

        res.json({
            requestedUser: restRequestedUser,
            message: 'Connection request sent'
        })

    } catch (error) {
        next(error)
    }
}

export default connectUser
