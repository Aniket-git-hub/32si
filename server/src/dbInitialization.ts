import mongoose, { ConnectOptions } from 'mongoose';
import dbConfig from './config/db.config';
import gridfs, { Grid } from 'gridfs-stream';

let gfs: Grid;
let gridfsBucket: mongoose.mongo.GridFSBucket;

async function connectToDatabase(): Promise<void> {
  try {
    const connection = await mongoose.connect(dbConfig.mongodb_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('[mongodb]: Connected to Database');
    const conn = connection.connection;
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'profile_Picture',
    });
    gfs = gridfs(conn.db, mongoose.mongo);
    gfs.collection('profile_Picture');
  } catch (error) {
    console.log(`[mongodb - Error]: ${(error as Error).message}`);
  }
}

export default connectToDatabase;
export { gfs, gridfsBucket };
