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
    bio: {
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
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    location: {
        name: {
            type: String,
        },
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        }
    },
    connectionRequests: [
        {
            type: String,
            ref: 'user'
        }
    ]
})

userSchema.index({ location: "2dsphere" })

const USER = mongoose.model('user', userSchema)
export default USER