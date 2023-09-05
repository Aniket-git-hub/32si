import USER from "../../models/user.js"

async function getAllUser(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        let skips = (page - 1) * 10
        const users = USER.find({}).skip(skips).limit(limit).exec()
        const count = USER.countDocuments({})
        res.status(200).json({
            users,
            total: count,
            page,
            limit
        })
    } catch (error) {
        next(error)
    }
} 

export default getAllUser