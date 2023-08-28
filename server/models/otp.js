import mongoose from "mongoose"
const otpSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    }, 
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 11,
    }
})

const otp = mongoose.model('Otp', otpSchema)
export default otp