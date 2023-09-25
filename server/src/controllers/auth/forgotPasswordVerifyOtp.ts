import { Request, Response, NextFunction } from 'express';
import OTP from '../../models/otp';
import bcrypt from 'bcryptjs';
import CustomError from '../../utils/createError';

/**
 * @description  controller to verify the OTP for password reset.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function forgotPasswordVerifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { otp, email } = req.body;
    const savedOtp = await OTP.findOne({ email });
    if (!savedOtp || !bcrypt.compareSync(String(otp), savedOtp.otp)) {
      throw new CustomError('InvalidOTP', 'Invalid OTP');
    }
    await OTP.deleteOne({ email });
    res.json({ message: 'OTP verified' });
  } catch (error) {
    next(error);
  }
}

export default forgotPasswordVerifyOtp;
