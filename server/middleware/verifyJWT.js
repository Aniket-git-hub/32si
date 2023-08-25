import jwt from 'jsonwebtoken'
import createJWTError from '../utils/createJWTError.js'

function verifyJWT(req, res, next) {
    let token
    let secret

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]
        secret = process.env.JWT_ACCESS_TOKEN_SECRET
    } else if (req.cookies.refreshToken) {
        token = req.cookies.refreshToken
        secret = process.env.JWT_REFRESH_TOKEN_SECRET
    } else {
        console.log("in else")
        return next(createJWTError('No token provided'))
    }

    try {
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()

    } catch (error) {
        next(createJWTError('Invalid token'))
    }
}

export default verifyJWT;