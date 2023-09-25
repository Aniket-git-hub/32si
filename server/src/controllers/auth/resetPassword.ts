import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';
import bcrypt from 'bcryptjs';
import { sendPasswordResetSuccessfulEmail } from '../../utils/sendEmail';
import CustomError from '../../utils/createError';

/**
 * @description  controller to reset the user password.
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Next middleware function.
 */
async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await USER.findOne({ email });
    if (!user) {
      throw new CustomError('AuthError', 'Invalid Email');
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
