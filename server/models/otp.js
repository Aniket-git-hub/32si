import mongoose from "mongoose"
const optSchema = mongoose.Schema({
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

})

const OTP = mongoose.model('otp', optSchema)
export default OTP