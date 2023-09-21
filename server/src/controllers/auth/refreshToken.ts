import { Request, Response } from 'express';
import generateToken from "../../utils/generateToken"

interface User {
    id: string;
    name: string;
    email: string;
    username: string;
}

/**
 * @description  controller to refresh the user token.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 */
function refreshToken(req: Request, res: Response) {
    const { id, name, email, username }: User = req.user
    const { accessToken } = generateToken({ id, name, email, username })
    res.json({ accessToken })
}

export default refreshToken
