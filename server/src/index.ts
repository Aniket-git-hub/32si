import 'dotenv/config';

import express, { Application, Response } from 'express';
import { getEnvironmentVariable } from './utils/Helper';
const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

/**
 *  cross-origin configuration
 *  prevents cross origin error and preflight error
 */
import cookieParser from 'cookie-parser';
import cors from 'cors';
const prodOrigins = [
  getEnvironmentVariable('ORIGIN_1'),
  getEnvironmentVariable('ORIGIN_2'),
  getEnvironmentVariable('ORIGIN_3'),
];
const devOrigin = ['http://localhost:5173'];
const allowedOrigins = getEnvironmentVariable('NODE_ENV') === 'production' ? prodOrigins : devOrigin;
app.use(
  cors({
    origin: (origin, callback) => {
      if (getEnvironmentVariable('NODE_ENV') === 'production') {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} not allowed by cors`));
        }
      } else {
        callback(null, true);
      }
    },
    optionsSuccessStatus: 200,
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
app.use(cookieParser());

/**
 * Database Connection
 * using mongoose
 */
import connectToDatabase from './dbInitialization';
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

import gameRoute from './routes/game';
app.use('/game', gameRoute);

import placesRoute from './routes/places';
app.use('/places', placesRoute);

/**
 * Middleware to handle error
 */
import errorHandler from './middleware/errorHandler';
app.use(errorHandler);

import { createServer } from 'http';
import { initializeSocketIO } from './initializeSocket';
const server = createServer(app);
initializeSocketIO(server);

server.listen(PORT, () => console.log(`[server]: running on port: ${PORT} | http://localhost:${PORT}/`));

export default app;
