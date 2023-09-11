import USER from '../../models/user.js'

async function connectUser(req, res, next) {
    try {
        const requestedUserId = req.params.userId
        const currentUserId = req.user.id

        const currentUser = await USER.findById(currentUserId)
        const requestedUser = await USER.findById(requestedUserId)

        if (currentUser.friends.includes(requestedUserId)) throw Error("You are Already Friends")

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