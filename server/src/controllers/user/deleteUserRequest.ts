import { NextFunction, Request, Response } from 'express';
import USER from '../../models/user';
import CustomError from '../../utils/createError';
import { sendAccountDeletionEmail } from '../../utils/sendEmail';
import generateDeletionToken from '../../utils/generateDeletionToken';
import { getEnvironmentVariable } from '../../utils/Helper';

async function deleteUserRequest(req: Request, res: Response, next: NextFunction) {
      try {
            const userId = req.user.id;
            const user = await USER.findById(userId);
            if (!user) throw new CustomError('DeleteError', 'User not found');

            const deletionToken = generateDeletionToken();

            user.deletionToken = deletionToken;
            await user.save();

            const serverURL = getEnvironmentVariable('NODE_ENV') === 'production' ? getEnvironmentVariable('SERVER_URL') : 'http://localhost:3000/'

            const confirmationLink: string = `${serverURL}user${getEnvironmentVariable('DELETE_USER_ROUTE')}${deletionToken}`;
            const cancellationLink: string = `${serverURL}user${getEnvironmentVariable('CANCEL_DELETE_USER_ROUTE')}${deletionToken}`;

            const { success, error } = await sendAccountDeletionEmail(user.email, user.name, confirmationLink, cancellationLink);
            if (!success) {
                  throw new CustomError('SendingEmail', 'Email not sent', error);
            }

            res.json({ message: 'Delete Account Confirmation Email Sent' });
      } catch (error) {
            next(error);
      }
}

export default deleteUserRequest;
