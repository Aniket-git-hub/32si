import { Document } from 'mongoose';

interface Otp extends Document {
  email: string;
  otp: string;
  purpose?: string;
  userId?: unknown;
  createdAt: Date;
}
