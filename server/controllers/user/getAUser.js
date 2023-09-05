import USER from "../../models/user.js"

async function getAUser(req, res, next) {
    const userId = req.params.userId
    try {
        const dbUser = await USER.findById(userId)
        const { password, ...rest } = dbUser._doc
        res.status(200).json({user: rest})
    } catch (error) {
        next(error)
    }
}
                
export default getAUser