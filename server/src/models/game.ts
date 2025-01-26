import mongoose, { Schema } from 'mongoose';
import { Game } from '../types/game';

const gameSchema = new mongoose.Schema<Game>({
  players: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    required: true,
  },
  winner: {
    type: Schema.Types.ObjectId,
    // required: true,
  },
  score: {
    type: String,
    // required: true,
  },
  startTime: {
    type: Date,
    // required: true,
  },
  endTime: {
    type: Date,
    // required: true,
  },
});

const GAME = mongoose.model<Game>('game', gameSchema);
export default GAME;
