import USER from "../../models/user.js"

async function getAUser(req, res, next) {
    const username = req.params.username;
    try {
        const dbUser = await USER.findOne({ username: username }).populate("friends")
        const { password, ...rest } = dbUser._doc
        res.status(200).json({user: rest})
    } catch (error) {
        next(error)
    }
}
                
export default getAUser