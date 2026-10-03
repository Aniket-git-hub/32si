import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import OTP from '../../models/otp';
import USER from '../../models/user';
import { sendEmailChangedEmail, sendOTPEmail } from '../../utils/sendEmail';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalize = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

/**
 * POST /user/email/change-request { newEmail, password }
 * Checks the password and sends a 6-digit code to the new address (proving the user owns it).
 */
export async function requestEmailChange(req: Request, res: Response, next: NextFunction) {
  try {
    const newEmail = normalize(req.body.newEmail);
    if (!EMAIL.test(newEmail)) return res.status(400).json({ message: 'Enter a valid email address.' });

    const user = await USER.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (typeof req.body.password !== 'string' || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: 'Your password is incorrect.' });
    }
    if (newEmail === user.email.toLowerCase()) {
      return res.status(400).json({ message: 'That is already your email address.' });
    }
    if (await USER.exists({ email: newEmail })) {
      return res.status(409).json({ message: 'Another account already uses this email.' });
    }

    const code = randomInt(100000, 1000000);
    await OTP.deleteMany({ userId: user._id, purpose: 'email-change' });
    await OTP.create({
      email: newEmail,
      otp: await bcrypt.hash(String(code), 12),
      purpose: 'email-change',
      userId: user._id,
    });

    const { success } = await sendOTPEmail(newEmail, user.name, code);
    if (!success) return res.status(424).json({ message: "We couldn't send an email to that address." });
    res.json({ message: `We sent a 6-digit code to ${newEmail}.` });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /user/email/change-confirm { newEmail, otp }
 * Switches the account to the new address and tells the old address about it.
 */
export async function confirmEmailChange(req: Request, res: Response, next: NextFunction) {
  try {
    const newEmail = normalize(req.body.newEmail);
    const saved = await OTP.findOne({ email: newEmail, userId: req.user.id, purpose: 'email-change' });
    if (!saved || !(await bcrypt.compare(String(req.body.otp ?? ''), saved.otp))) {
      return res.status(400).json({ message: 'That code is wrong or has expired.' });
    }
    if (await USER.exists({ email: newEmail })) {
      return res.status(409).json({ message: 'Another account already uses this email.' });
    }

    const user = await USER.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();
    await OTP.deleteMany({ userId: user._id, purpose: 'email-change' });
    // Best effort: the change already happened, a failed notice shouldn't undo it.
    void sendEmailChangedEmail(oldEmail, user.name, newEmail);

    const populated = await USER.findById(user._id).populate('friends');
    const { password, ...rest } = populated!.toObject();
    res.json({ message: 'Your email address was updated.', user: rest });
  } catch (error) {
    next(error);
  }
}
