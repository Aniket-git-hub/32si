import { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const minutes = (n: number) => n * 60_000;
const limitMessage = (message: string) => ({ message });

/** Login / registration: generous enough for typos, stops password guessing. */
export const authLimiter = rateLimit({
  windowMs: minutes(15),
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: limitMessage('Too many attempts. Please wait a few minutes and try again.'),
});

/** Password reset: emails and 6-digit codes are expensive / guessable, so keep these tight. */
export const otpLimiter = rateLimit({
  windowMs: minutes(15),
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: limitMessage('Too many password reset attempts. Please wait 15 minutes and try again.'),
});

/** Everything else: a ceiling that normal use never reaches. */
const apiLimiter = rateLimit({
  windowMs: minutes(1),
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: limitMessage('Too many requests. Please slow down.'),
});

export const applySecurity = (app: Application) => {
  // Render (and most hosts) put the app behind one proxy; needed for correct client IPs in the rate limiter.
  app.set('trust proxy', 1);
  app.use(
    helmet({
      // Profile pictures are loaded by the front-end from another origin.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(apiLimiter);
};

/**
 * Socket.io: drop events from a socket that sends more than `limit` per `windowMs`
 * (a game needs a handful per second at most).
 */
export const createSocketThrottle = (limit = 30, windowMs = 1000) => {
  let windowStart = Date.now();
  let count = 0;
  return (): boolean => {
    const now = Date.now();
    if (now - windowStart >= windowMs) {
      windowStart = now;
      count = 0;
    }
    count++;
    return count <= limit;
  };
};
