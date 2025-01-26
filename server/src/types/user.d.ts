import { Document, Schema } from 'mongoose';

interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePhoto: string;
  bio: string;
  gamesPlayed: Schema.Types.ObjectId[];
  friends: Schema.Types.ObjectId[];
  location: {
    name: string;
    type: string;
    coordinates: number[];
  };
  connectionRequests: string[];
  deletionToken: string;
  createdGames: string;
}
