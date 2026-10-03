import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import bcrypt from 'bcryptjs';
import { sendPasswordResetSuccessfulEmail } from '../../utils/sendEmail';
import CustomError from '../../utils/createError';
import { isValidResetToken } from '../../utils/resetToken';

/**
 * @description  controller to reset the user password.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, resetToken } = req.body;
    const user = await USER.findOne({ email });
    if (!user || !isValidResetToken(resetToken, email, user.password)) {
      // Same answer for unknown emails and bad tokens.
      return res.status(400).json({ message: 'This reset link has expired. Please request a new code.' });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    await user.save();

    const { success, error } = await sendPasswordResetSuccessfulEmail(email, user.name);
    if (!success) {
      throw new CustomError('SendingEmail', 'Email Not Sent', error as Error);
    }

    res.json({
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
}

export default resetPassword;
