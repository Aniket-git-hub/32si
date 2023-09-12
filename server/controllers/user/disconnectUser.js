import USER from '../../models/user.js'

async function disconnectUser(req, res, next) {
    try {
        const requestedUserId = req.params.userId
        const currentUserId = req.user.id

        const [currentUser, requestedUser] = await Promise.all([
            USER.findById(currentUserId),
            USER.findById(requestedUserId)
        ])

        if (!currentUser.friends.includes(requestedUserId)) {
            throw new Error("You are not friends with this user")
        }

        currentUser.friends = currentUser.friends.filter(id => id.toString() !== requestedUserId)
        requestedUser.friends = requestedUser.friends.filter(id => id.toString() !== currentUserId)

        const [savedCurrentUser, savedRequestedUser] = await Promise.all([
            currentUser.save(),
            requestedUser.save()
        ])

        let populatedCurrentUser = await USER.findById(savedCurrentUser._id).populate('friends')

        const { password, ...restCurrentUser } = populatedCurrentUser._doc
        const { password: Rpassword, ...restRequestedUser } = requestedUser._doc

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

