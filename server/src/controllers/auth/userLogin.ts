import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import USER from '../../models/user';
import generateToken from '../../utils/generateToken';
import CustomError from '../../utils/createError';
import { getEnvironmentVariable } from '../../utils/Helper';

/**
 * @description  controller to login the user.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password: pass } = req.body;
  try {
    const user = await USER.findOne({ email }).populate('friends');

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new CustomError('AuthError', 'Invalid Email or Password');
    }

    const { accessToken, refreshToken } = generateToken({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: getEnvironmentVariable('NODE_ENV') === 'production' ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
      domain: getEnvironmentVariable('NODE_ENV') === 'production' ? getEnvironmentVariable('ORIGIN_2') : 'localhost',
      path: '/',
    });

    const { password, ...rest } = user.toObject();
    res.status(200).json({
      message: 'User logged in successfully',
      accessToken,
      user: rest,
    });
  } catch (error) {
    next(error);
  }
}

export default login;
