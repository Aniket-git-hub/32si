import USER from "../../models/user";
import CustomError from "../../utils/createError";
import { Request, Response, NextFunction } from "express";
import { sendAccountDeletionCancellationEmail } from "../../utils/sendEmail";

async function cancelAccountDeletion(req: Request, res: Response, next: NextFunction) {
      try {
            const { token } = req.params;
            const user = await USER.findOne({ deletionToken: token });

            if (!user) {
                  throw new CustomError('InvalidToken', 'Invalid deletion token');
            }

            user.deletionToken = '';
            await user.save();

            const { success, error } = await sendAccountDeletionCancellationEmail(user.email, user.name)
            if (!success) {
                  throw new CustomError("SendingEmail", "Email not sent", error)
            }

            res.json({ message: 'Account Deletion Request Cancelled' });
      } catch (error) {
            next(error);
      }
}

export default cancelAccountDeletion;
