import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';
import generateToken from '../../utils/generateToken';
import { sendRegistrationSuccessfulEmail } from '../../utils/sendEmail';

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, username, email, password: pass } = req.body;
    const hashedPassword = bcrypt.hashSync(pass, 12);

    const newUser = new USER({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const { accessToken, refreshToken } = generateToken({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      username: savedUser.username,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? process.env.ORIGIN_2 : 'localhost',
      path: '/',
    });

    if (process.env.NODE_ENV === 'production') {
      const { success, error } = await sendRegistrationSuccessfulEmail(savedUser.email, savedUser.name);
      if (!success) {
        console.error('SendingEmail Error:', error);
      }
    }

    const populatedUser = await USER.findById(savedUser._id).populate('friends');
    if (!populatedUser) {
      throw new CustomError('RegistrationError', 'populated user not found');
    }

    const { password, ...rest } = populatedUser.toObject();
    res.status(201).json({
      message: 'New User Created Successfully',
      accessToken,
      user: rest,
    });
  } catch (error) {
    next(error);
  }
}

export default register;
