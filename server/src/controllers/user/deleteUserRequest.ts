import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';
import { sendAccountDeletionEmail } from '../../utils/sendEmail';
import generateDeletionToken from '../../utils/generateDeletionToken';
import { getEnvironmentVariable, getRoute } from '../../utils/Helper';
import OTP from '../../models/otp';
import bcrypt from 'bcryptjs';


async function deleteUserRequest(req: Request, res: Response, next: NextFunction) {
      try {
            const userId = req.user.id;
            const user = await USER.findById(userId);
            if (!user) throw new CustomError('DeleteError', 'User not found');

            const deletionToken = generateDeletionToken();

            user.deletionToken = deletionToken;
            await user.save();

            const otp = Math.floor(100000 + Math.random() * 900000);
            const newOtp = new OTP({
                  email: user.email,
                  otp: bcrypt.hashSync(String(otp), 12)
            })
            await newOtp.save()

            const serverURL = getEnvironmentVariable('NODE_ENV') === 'production' ? getEnvironmentVariable('SERVER_URL') : 'http://localhost:5173/'

            const confirmationLink: string = `${getRoute("DELETE_ACCOUNT_URL", 'http://localhost:5173/delete-account/')}${deletionToken}`;
            const cancellationLink: string = `${getRoute("CANCEL_DELETE_ACCOUNT_URL", "http://localhost:5173/cancel-delete-account/")}${deletionToken}`;

            const { success, error } = await sendAccountDeletionEmail(user.email, user.name, confirmationLink, otp, cancellationLink);
            if (!success) {
                  throw new CustomError('SendingEmail', 'Email not sent', error);
            }

            res.json({ message: 'Delete Account Confirmation Email Sent' });
      } catch (error) {
            next(error);
      }
}

export default deleteUserRequest;
