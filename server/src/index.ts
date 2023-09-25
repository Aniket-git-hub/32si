import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

/**
 *  cross-origin configuration
 *  prevents cross origin error and preflight error
 */
import cors from 'cors';
const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigin = ['http://localhost:5173'];
const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigin;
app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

/**
 * body-parser configuration for post and put requests
 * Allows server to receive data from the client
 */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
import cookieParser from 'cookie-parser';
app.use(cookieParser());

/**
 * Database Connection
 * using mongoose
 */
import connectToDatabase from './db';
connectToDatabase();

/**
 * Routes
 * 1. '/' - Home page
 * 2. '/auth' - Authentication Routes
 * 3. '/user' - User Routes
 */
app.get('/', (req, res: Response) => res.send('Hello world!'));

import authRoute from './routes/auth';
app.use('/auth', authRoute);

import userRoute from './routes/user';
app.use('/user', userRoute);

import placesRoute from './routes/places';
app.use('/places', placesRoute);

/**
 * Middleware to handle error
 */
import errorHandler from './middleware/errorHandler';
app.use(errorHandler);
// fallback default error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('An error occurred!');
});

import { createServer } from 'http';
import { initializeSocketIO } from './initializeSocket';
const server = createServer(app);
initializeSocketIO(server);

server.listen(PORT, () => console.log(`[server]: running on port: ${PORT} | http://localhost:${PORT}/`));

export default app;
