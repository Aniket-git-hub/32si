import { Request, Response } from 'express';
import generateToken from '../../utils/generateToken';

/**
 * @description  controller to refresh the user token.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 */
function refreshToken(req: Request, res: Response) {
  const { id, name, email, username } = req.user;
  const { accessToken } = generateToken({ id, name, email, username });
  res.json({ accessToken });
}

export default refreshToken;
