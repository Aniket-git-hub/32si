import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import CustomError from '../utils/createError';

interface ErrorInfo {
  status: number;
  message: string | ((error: Error) => string);
}

const errorTypeMap: Record<string, ErrorInfo> = {
  ValidationError: {
    status: 400,
    message: (error) =>
      `Validation Error: ${
        (error as CustomError).errors.length > 0 ? (error as CustomError).errors.join(', ') : error.message
      }`,
  },
  CastError: { status: 404, message: "Uh-oh! The resource you're looking for cannot be found." },
  '11000': { status: 409, message: "Hold on! It looks like there's a duplicate key error." },
  JsonWebTokenError: { status: 401, message: 'Hmm... The token provided seems to be invalid.' },
  SyntaxError: { status: 400, message: (error) => `Oops! There seems to be a syntax error: ${error.message}` },
  AuthError: { status: 401, message: (error) => `Uh-oh! There seems to be a auth error: ${error.message}` },
  TokenExpiredError: { status: 401, message: 'Oh no! Your token has expired.' },
  InvalidOTP: { status: 400, message: 'Oh no! Your otp is invalid.' },
  SendingEmail: { status: 424, message: "Couldn't Send Email..." },
};

/**
 * @description middleware function which sends appropriate error response to the client
 * @param {Error} error Error Object
 * @param {Request} req Express.js Request Object
 * @param {Response} res Express.js Response Object
 * @param {NextFunction} next Express.js NextFunction
 */
// Express recognises error handlers by their four parameters, so `next` must stay even though it is unused.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  // process.env is read directly: getEnvironmentVariable throws for unset variables, which would turn
  // every error response into a generic 500.
  if (process.env.NODE_ENV === 'development' || process.env.TEST) {
    console.log(`[server]: Request: ${req.path} - [error]: ${error.message}`);
  }

  let errorInfo;
  const errorType = error instanceof MongoError ? error.code : error.name;
  if (errorType) {
    errorInfo = errorTypeMap[errorType];
  }
  errorInfo = errorInfo || { status: 500, message: 'Internal Server Error' };

  res?.status(errorInfo.status).json({
    message: typeof errorInfo.message === 'function' ? errorInfo.message(error) : errorInfo.message,
  });
}

export default errorHandler;
