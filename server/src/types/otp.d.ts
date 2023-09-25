import { Document } from 'mongoose';

interface Otp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}
