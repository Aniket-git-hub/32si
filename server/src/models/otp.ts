import mongoose, { Document, Schema } from "mongoose";

interface IOtp extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

const optSchema = new Schema<IOtp>({
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
        default: Date.now
    },
});

const OTP = mongoose.model<IOtp>('otp', optSchema);
export default OTP;
