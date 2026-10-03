import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../src/middleware/errorHandler';
import CustomError from '../../src/utils/createError';

const run = (error: Error) => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  errorHandler(error, { path: '/x' } as Request, res as unknown as Response, jest.fn() as NextFunction);
  return res;
};

describe('errorHandler', () => {
  const env = process.env;
  beforeEach(() => {
    process.env = { ...env, NODE_ENV: 'production' };
    delete process.env.TEST;
  });
  afterAll(() => {
    process.env = env;
  });

  it('maps known errors to their status in production (TEST unset)', () => {
    const res = run(new CustomError('JsonWebTokenError', 'bad token'));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Hmm... The token provided seems to be invalid.' });
  });

  it('includes validation details', () => {
    const error = new CustomError('ValidationError', 'invalid');
    error.errors = ['email is required'];
    const res = run(error);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toContain('email is required');
  });

  it('hides unknown errors behind a 500', () => {
    const res = run(new Error('database exploded'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
