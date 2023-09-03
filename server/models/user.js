import mongoose, { Schema } from "mongoose"
const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        unique: true,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
        max: 500,
    },
    gamesPlayed: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'game'
            }
        ]
    },
    friends: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    }
})

const USER = mongoose.model('user', userSchema)
export default USER