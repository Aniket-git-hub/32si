import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import CustomError from '../utils/createError'

function verifyJWT(req: Request, res: Response, next: NextFunction) {
    let token: string
    let secret: string

    if (!process.env.JWT_ACCESS_TOKEN_SECRET || !process.env.JWT_REFRESH_TOKEN_SECRET) {
        throw new CustomError('JsonWebTokenError', "Token not provided")
    }

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]
        secret = process.env.JWT_ACCESS_TOKEN_SECRET
    } else if (req.cookies.refreshToken) {
        token = req.cookies.refreshToken
        secret = process.env.JWT_REFRESH_TOKEN_SECRET
    } else {
        throw new CustomError("JsonWebTokenError", 'No token provided')
    }

    try {
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()

    } catch (error: any) {
        next(new CustomError("JsonWebTokenError", 'Invalid token', error))
    }
}

export default verifyJWT;