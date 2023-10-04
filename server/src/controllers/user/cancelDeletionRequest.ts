import USER from "../../models/user";
import CustomError from "../../utils/createError";
import { Request, Response, NextFunction } from "express";

async function cancelAccountDeletion(req: Request, res: Response, next: NextFunction) {
      try {
            const { token } = req.params;
            const user = await USER.findOne({ deletionToken: token });

            if (!user) {
                  throw new CustomError('InvalidToken', 'Invalid deletion token');
            }

            user.deletionToken = '';
            await user.save();

            res.json({ message: 'Account Deletion Request Cancelled' });
      } catch (error) {
            next(error);
      }
}

export default cancelAccountDeletion;
