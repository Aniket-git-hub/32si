import { getEnvironmentVariable } from '../utils/Helper';

const isProduction = () => getEnvironmentVariable('NODE_ENV') === 'production';

const allowedOrigins = () =>
  isProduction()
    ? [getEnvironmentVariable('ORIGIN_1'), getEnvironmentVariable('ORIGIN_2'), getEnvironmentVariable('ORIGIN_3')]
    : ['http://localhost:5173'];

/** Origin check shared by express (cors) and socket.io so both accept the same front-ends. */
export const corsOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  if (!isProduction() || !origin || allowedOrigins().includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error(`${origin} not allowed by cors`));
  }
};
