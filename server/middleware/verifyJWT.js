import jwt from 'jsonwebtoken'
 
function verifyJWT(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1]
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
            req.user = decoded
            next()
        } catch (error) {
            next(error)
        }
    } else if (req.cookie.refreshToken) {
        const refreshToken = req.cookie.refreshToken
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
            req.user = decoded
            next()
        } catch (error) {
            next(error)
        }
    } else {
        let err = new Error("No token provided")
        err.name = "JsonWebTokenError"
        next(err)
    }
}

export default verifyJWT