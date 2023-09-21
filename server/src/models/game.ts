import mongoose, { Document, Schema } from "mongoose";

interface IGame extends Document {
    players: Schema.Types.ObjectId[];
    winner: Schema.Types.ObjectId;
    score: string;
    startTime: Date;
    endTime: Date;
}

const gameSchema = new mongoose.Schema<IGame>({
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
});

const GAME = mongoose.model<IGame>('game', gameSchema);
export default GAME;
