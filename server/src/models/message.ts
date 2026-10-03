import mongoose, { Schema } from 'mongoose';

export const MAX_MESSAGE_LENGTH = 1000;

export interface Message {
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  readAt?: Date | null;
}

const messageSchema = new mongoose.Schema<Message>({
  from: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  text: { type: String, required: true, maxlength: MAX_MESSAGE_LENGTH },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null },
});

// Conversation history (both directions) and unread counts.
messageSchema.index({ from: 1, to: 1, createdAt: -1 });
messageSchema.index({ to: 1, readAt: 1 });

const MESSAGE = mongoose.model<Message>('message', messageSchema);
export default MESSAGE;
