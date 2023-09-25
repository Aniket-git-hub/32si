import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import OTP from '../../models/otp';
import { sendOTPEmail, sendPasswordResetInitiatedEmail } from '../../utils/sendEmail';
import bcrypt from 'bcryptjs';
import CustomError from '../../utils/createError';

/**
 * @description  controller to handle forgot password.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const savedUser = await USER.findOne({ email });
    if (!savedUser) {
      throw new CustomError('AuthError', 'Invalid Email');
    }

    const { success: initSuccess, error: initError } = await sendPasswordResetInitiatedEmail(email, savedUser.name);
    if (!initSuccess) {
      throw new CustomError('SendingEmail', 'Email Not Sent', initError as Error);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const newOtp = new OTP({
      email,
      otp: bcrypt.hashSync(String(otp), 12),
    });
    await newOtp.save();

    const { success: otpSuccess, error: otpError } = await sendOTPEmail(email, savedUser.name, otp);
    if (!otpSuccess) {
      throw new CustomError('SendingEmail', 'Email Not Sent', otpError as Error);
    }

    res.json({ message: 'Otp Sent Successfully' });
  } catch (error) {
    next(error);
  }
}

export default forgotPassword;
