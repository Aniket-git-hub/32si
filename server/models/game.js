import mongoose, { Schema } from "mongoose"
const gameSchema = mongoose.Schema({
    players: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        required: true,
    },
    winner: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    score: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    }

})

const GAME = mongoose.model('game', gameSchema)
export default GAME