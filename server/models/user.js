import mongoose from "mongoose"
const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        unique: true,
        require:true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const user = mongoose.model('User', userSchema)
export default user