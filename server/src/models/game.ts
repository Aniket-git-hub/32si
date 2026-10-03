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
  code: {
    type: String,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  result: {
    type: String,
    enum: ['red', 'blue', 'draw'],
  },
  reason: {
    type: String,
  },
  moves: {
    type: Number,
  },
  // Encoded actions for replays (from * 45 + to, -1 = end a capture chain early).
  history: {
    type: [Number],
    default: undefined,
  },
  rated: {
    type: Boolean,
    default: false,
  },
  ratingChanges: {
    red: Number,
    blue: Number,
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
