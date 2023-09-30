import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/createError';
import { getEnvironmentVariable } from '../utils/Helper';

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  let token: string;
  let secret: string;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
    secret = getEnvironmentVariable('JWT_ACCESS_TOKEN_SECRET');
  } else if (req.cookies.refreshToken) {
    token = req.cookies.refreshToken;
    secret = getEnvironmentVariable('JWT_REFRESH_TOKEN_SECRET');
  } else {
    throw new CustomError('JsonWebTokenError', 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error: unknown) {
    next(new CustomError('JsonWebTokenError', 'Invalid token', error as Error));
  }
}

export default verifyJWT;
