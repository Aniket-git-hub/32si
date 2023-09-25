import { Document, Schema } from 'mongoose';

interface Game extends Document {
  players: Schema.Types.ObjectId[];
  winner: Schema.Types.ObjectId;
  score: string;
  startTime: Date;
  endTime: Date;
}
