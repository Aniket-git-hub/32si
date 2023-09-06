import USER from "../../models/user.js"

async function updateUser(req, res, next) {
    try {
        const {userId, ...otherData} = req.body
        const savedUser = await USER.findByIdAndUpdate(userId, otherData, {
            new: true,
            runValidators:true,
        })
        const { password, ...rest } = savedUser._doc
        res.status(200).json({
            message: "User updated successfully",
            user: rest
        })
    } catch (error) {
        next(error)
    }
}
export default updateUser