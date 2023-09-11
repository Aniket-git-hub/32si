import USER from '../../models/user.js'

async function disconnectUser(req, res, next) {
    try {
        const requestedUserId = req.params.userId
        const currentUserId = req.user.id
    
        const currentUser = await USER.findById(currentUserId)
        const requestedUser = await USER.findById(requestedUserId)

        if (!currentUser.friends.includes(requestedUserId)) throw Error("You are not friends ")
    
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== requestedUserId)
        requestedUser.friends = requestedUser.friends.filter(id => id.toString() !== currentUserId)
    
        const savedCurrentUser = await currentUser.save()
        const { password, ...restCurrentUser } = savedCurrentUser.populate("friends").execPopulate()._doc
        const savedRequestedUser = await requestedUser.save()
        const { password: Rpassword, ...restRequestedUser } = savedRequestedUser._doc
    
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