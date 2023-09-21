import mongoose, { ConnectOptions } from 'mongoose';
import dbConfig from './config/db.config';

async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(dbConfig.mongodb_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log("[mongodb]: Connected to Database");
    } catch (error) {
        console.log(`[mongodb - Error]: ${(error as Error).message}`);
    }
}

export default connectToDatabase;
