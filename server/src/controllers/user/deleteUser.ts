import { NextFunction, Request, Response } from "express";
import USER from "../../models/user";
import CustomError from "../../utils/createError";
import { sendAccountDeletionEmail } from "../../utils/sendEmail";

async function deleteUser(req: Request, res: Response, next: NextFunction) {
      try {
            const userId = req.user.id
            const user = await USER.findById(userId)
            if (!user) throw new CustomError("DeleteError", "user not found")

            const { success, error } = await sendAccountDeletionEmail(user.email, user.name)
            if (!success) {
                  throw new CustomError("SendingEmail", "Email not sent", error)
            }

            const friends = await USER.find({ $id: { $in: user.friends } })
            const updates = friends.map(friend => {
                  return USER.updateOne(
                        { _id: friend._id },
                        { $pull: { friends: userId } }
                  );
            })
            await Promise.all(updates)
            await USER.deleteOne({ _id: userId })
            res.json({ message: "User Deleted Successfully" })

      } catch (error) {
            next(error)
      }
}

export default deleteUser