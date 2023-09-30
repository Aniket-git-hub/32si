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
  createdAt: {
    type: Date,
    expires: 120,
    default: Date.now,
  },
});

const OTP = mongoose.model<Otp>('otp', optSchema);
export default OTP;
