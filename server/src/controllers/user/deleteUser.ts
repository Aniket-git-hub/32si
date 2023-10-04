import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';
import { sendAccountDeletionSuccesfullEmail } from '../../utils/sendEmail';
import OTP from '../../models/otp';
import bcrypt from 'bcryptjs';


async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.params.token;
    const user = await USER.findOne({ deletionToken: token });
    if (!user) throw new CustomError('DeleteError', 'user not found');
    const userId = user._id

    const { otp } = req.body

    const savedOtp = await OTP.findOne({ email: user.email })
    if (!savedOtp || !bcrypt.compareSync(String(otp), savedOtp.otp)) {
      throw new CustomError("InvalidOTP", "Invalid OTP")
    }

    const { success, error } = await sendAccountDeletionSuccesfullEmail(user.email, user.name);
    if (!success) {
      throw new CustomError('SendingEmail', 'Email not sent', error);
    }

    const friends = await USER.find({ $id: { $in: user.friends } });
    const updates = friends.map((friend) => {
      return USER.updateOne({ _id: friend._id }, { $pull: { friends: userId } });
    });
    await Promise.all(updates);
    await USER.deleteOne({ _id: userId });
    res.json({ message: 'User Deleted Successfully' });
  } catch (error) {
    next(error);
  }
}

export default deleteUser;
