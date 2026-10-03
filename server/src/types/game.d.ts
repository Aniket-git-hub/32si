import { Document, Schema } from 'mongoose';

interface Game extends Document {
  players: Schema.Types.ObjectId[];
  code?: string;
  winner?: Schema.Types.ObjectId;
  result?: 'red' | 'blue' | 'draw';
  reason?: string;
  moves?: number;
  score: string;
  startTime: Date;
  endTime: Date;
}
