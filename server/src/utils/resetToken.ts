import { createHash } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getEnvironmentVariable } from './Helper';

/**
 * Short-lived token proving that a password-reset code was verified for an email.
 * It is bound to the current password hash, so it stops working once the password has changed
 * (single use) and can't be used for any other purpose.
 */
const secret = () => `${getEnvironmentVariable('JWT_ACCESS_TOKEN_SECRET')}:password-reset`;
const fingerprint = (passwordHash: string) => createHash('sha256').update(passwordHash).digest('hex').slice(0, 16);

export const createResetToken = (email: string, passwordHash: string) =>
  jwt.sign({ email, pw: fingerprint(passwordHash), purpose: 'password-reset' }, secret(), { expiresIn: '10m' });

export const isValidResetToken = (token: unknown, email: string, passwordHash: string): boolean => {
  if (typeof token !== 'string') return false;
  try {
    const payload = jwt.verify(token, secret()) as JwtPayload;
    return payload.purpose === 'password-reset' && payload.email === email && payload.pw === fingerprint(passwordHash);
  } catch {
    return false;
  }
};
