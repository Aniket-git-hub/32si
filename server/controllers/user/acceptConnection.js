import USER from '../../models/user.js'

async function acceptConnection(req, res, next) {
    try {

        const requestedUserId = req.params.userId
        const currentUserId = req.user.id

        const currentUser = await USER.findById(currentUserId)
        const requestedUser = await USER.findById(requestedUserId)
        
        if (currentUser.friends.includes(requestedUserId)) throw Error("You are Already Friends")
        
        const index = requestedUser.connectionRequests.indexOf(currentUserId)
        if (index > -1) {
            requestedUser.connectionRequests.splice(index, 1)
        }

        currentUser.friends.push(requestedUser)
        requestedUser.friends.push(currentUserId)

        const savedCurrentUser = await currentUser.save()
        const { password, ...restCurrentUser } = savedCurrentUser._doc
        const savedRequestedUser = await requestedUser.save()
        const { password: Rpassword, ...restRequestedUser} = savedRequestedUser._doc
        
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