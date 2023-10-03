import { Request, Response, NextFunction } from 'express';
import { sendFeedbackReceivedEmail, sendNewFeedbackReceivedEmail } from '../../utils/sendEmail';
import CustomError from '../../utils/createError';

async function postApplicationFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, message } = req.body;
    // save the feedback to db
    const { success, error } = await sendFeedbackReceivedEmail(email, name);
    if (!success) {
      throw new CustomError('SendingEmail', 'Email Not Sent', error as Error);
    }
    const { success: successN, error: errorN } = await sendNewFeedbackReceivedEmail(
      'singhdharmvir81@gmail.com',
      name,
      message,
      email,
    );
    if (!successN) {
      throw new CustomError('SendingEmail', 'Email Not Sent', errorN as Error);
    }

    res.status(200).json({ message: 'feedback received!' });
  } catch (error) {
    next(error);
  }
}

export default postApplicationFeedback;
