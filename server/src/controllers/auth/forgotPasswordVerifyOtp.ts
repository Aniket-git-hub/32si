import { Request, Response, NextFunction } from 'express';
import OTP from '../../models/otp';
import bcrypt from 'bcryptjs';
import CustomError from '../../utils/createError';
import USER from '../../models/user';
import { createResetToken } from '../../utils/resetToken';

/**
 * @description  controller to verify the OTP for password reset.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function forgotPasswordVerifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { otp, email } = req.body;
    const savedOtp = await OTP.findOne({ email, purpose: { $ne: 'email-change' } });
    if (!savedOtp || !bcrypt.compareSync(String(otp), savedOtp.otp)) {
      throw new CustomError('InvalidOTP', 'Invalid OTP');
    }
    await OTP.deleteOne({ _id: savedOtp._id });
    const user = await USER.findOne({ email });
    if (!user) throw new CustomError('AuthError', 'Invalid Email');
    // The reset step must present this token; without it anyone could reset any password.
    res.json({ message: 'OTP verified', resetToken: createResetToken(email, user.password) });
  } catch (error) {
    next(error);
  }
}

export default forgotPasswordVerifyOtp;
