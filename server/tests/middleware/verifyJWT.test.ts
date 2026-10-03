import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import verifyJWT from '../../src/middleware/verifyJWT';

process.env.JWT_ACCESS_TOKEN_SECRET = 'access-secret';
process.env.JWT_REFRESH_TOKEN_SECRET = 'refresh-secret';

const call = (req: Partial<Request>) => {
  const next = jest.fn();
  const request = { headers: {}, cookies: {}, ...req } as Request;
  verifyJWT(request, {} as Response, next as NextFunction);
  return { next, request };
};

describe('verifyJWT', () => {
  it('accepts a valid access token and exposes the user', () => {
    const token = jwt.sign({ id: 'u1', username: 'alice' }, 'access-secret');
    const { next, request } = call({ headers: { authorization: `Bearer ${token}` } });
    expect(next).toHaveBeenCalledWith();
    expect(request.user).toMatchObject({ id: 'u1', username: 'alice' });
  });

  it('accepts a refresh token cookie', () => {
    const token = jwt.sign({ id: 'u1' }, 'refresh-secret');
    const { next, request } = call({ cookies: { refreshToken: token } });
    expect(next).toHaveBeenCalledWith();
    expect(request.user.id).toBe('u1');
  });

  it('rejects a token signed with the wrong secret', () => {
    const token = jwt.sign({ id: 'u1' }, 'someone-else');
    const { next } = call({ headers: { authorization: `Bearer ${token}` } });
    expect(next.mock.calls[0][0]).toMatchObject({ name: 'JsonWebTokenError' });
  });

  it('rejects requests without any token', () => {
    expect(() => call({})).toThrow('No token provided');
  });
});
