import mongoose from "mongoose"
const optSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 11
    }
})

const opt = mongoose.model('Otp', optSchema)
export default opt