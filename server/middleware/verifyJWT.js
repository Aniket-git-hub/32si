import jwt from 'jsonwebtoken'
 
function verifyJWT(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1]
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded
            next()
        } catch (error) {
            next(error)
        }
    } else {
        let err = new Error(" No token provided ")
        err.name = "JsonWebTokenError"
        next(err)
    }
}

export default verifyJWT