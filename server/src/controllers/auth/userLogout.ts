import { Request, Response, NextFunction } from 'express';
/**
 * @description  controller to log out the user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken', { path: '/' });
    res.status(200).json({
      message: 'user logged out',
    });
  } catch (error) {
    next(error);
  }
}

export default logout;
