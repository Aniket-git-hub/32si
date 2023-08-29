import mongoose from "mongoose"
const optSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 120,
        default: Date.now
    },

})

const OTP = mongoose.model('Otp', optSchema)
export default OTP