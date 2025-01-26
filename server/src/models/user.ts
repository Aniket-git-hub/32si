import mongoose, { Schema } from 'mongoose';
import { User } from '../types/user';

const userSchema = new mongoose.Schema<User>({
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
    default: '',
  },
  bio: {
    type: String,
    default: '',
    max: 500,
  },
  gamesPlayed: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'game',
      },
    ],
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  location: {
    name: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  connectionRequests: [
    {
      type: String,
      ref: 'user',
    },
  ],
  deletionToken: {
    type: String,
  },
  createdGames: [
    { type: String }
  ]

});

userSchema.index({ location: '2dsphere' });
userSchema.index({ username: 'text', name: 'text' });

const USER = mongoose.model<User>('user', userSchema);
export default USER;
