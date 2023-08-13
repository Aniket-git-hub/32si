import 'dotenv/config'

import epxress from 'express'
const app = epxress()
const PORT = process.env.PORT || 3000

/**
 * Routes 
 * 1. '/' - Home page
 * 2. '/auth' - Authentication Routes
 * 3. '/user' - User Routes
 */
app.get("/", (req, res) => res.send("Hello world!"))

import authRoute from './routes/auth.js' 
app.use("/auth", authRoute)


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))