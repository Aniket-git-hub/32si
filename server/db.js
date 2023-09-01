import mongoose from 'mongoose'
import dbConfig from './config/db.config.js'

async function connectToDatabase() {
    try {
        await mongoose.connect(dbConfig.mongodb_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("[mongodb]: Connected to Database")
    } catch (error) {
        console.log(`[mongodb - Error]: ${error.message}`)
    }
}
export default connectToDatabase