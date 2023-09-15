import USER from '../../models/user.js'

async function connectUser(req, res, next) {
    try {
        const requestedUsername = req.params.username
        const currentUserId = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(currentUserId),
            USER.findOne({ username: requestedUsername })
        ])

        if (!requestedUser) {
            throw new Error("Requested user not found")
        }

        const requestedUserId = requestedUser._id

        if (currentUser.friends.includes(requestedUserId) || requestedUser.connectionRequests.includes(currentUser.username)) {
            throw new Error("You are already friends or a connection request has already been sent")
        }

        requestedUser.connectionRequests.push(currentUser.username)

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