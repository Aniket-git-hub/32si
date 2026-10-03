import mongoose, { Schema } from 'mongoose';
import { Otp } from '../types/otp';

const optSchema = new Schema<Otp>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // 'password-reset' (default) or 'email-change'; codes only work for the purpose they were sent for.
  purpose: {
    type: String,
    default: 'password-reset',
  },
  // For email changes: the account whose email is being changed.
  userId: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    expires: 120,
    default: Date.now,
  },
});

const OTP = mongoose.model<Otp>('otp', optSchema);
export default OTP;
