import 'dotenv/config'

import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

/**
 *  crossorigin configuration 
 *  prevents cross origin error and preflight error
 */
import cors from 'cors'
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

/**
 * bodyparser configuration for post and put requests
 * Allows server to receive data from the client 
 */
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


/**
 * Database Connection
 * using mongoose
 */
import dbConfig from './config/db.config.js'
import mongoose from 'mongoose' 
try {
    await mongoose.connect(dbConfig.mongodb_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("Connected to Database")
} catch (error) {
    console.log(error.message)
}


/**
 * Routes 
 * 1. '/' - Home page
 * 2. '/auth' - Authentication Routes
 * 3. '/user' - User Routes
 */
app.get("/", (req, res) => res.send("Hello world!"))

import authRoute from './routes/auth.js' 
app.use("/auth", authRoute)

/**
 * Middleware to handle error
 */
import errorHandler from './middleware/errorHandler.js'
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))