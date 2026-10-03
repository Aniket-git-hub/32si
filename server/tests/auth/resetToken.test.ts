import { createResetToken, isValidResetToken } from '../../src/utils/resetToken';

process.env.JWT_ACCESS_TOKEN_SECRET = 'secret';

describe('password reset token', () => {
  const token = createResetToken('a@x.com', 'hash-1');

  it('is accepted for the same email and password hash', () => {
    expect(isValidResetToken(token, 'a@x.com', 'hash-1')).toBe(true);
  });

  it('is rejected when missing, for another email, or after the password changed (single use)', () => {
    expect(isValidResetToken(undefined, 'a@x.com', 'hash-1')).toBe(false);
    expect(isValidResetToken(token, 'b@x.com', 'hash-1')).toBe(false);
    expect(isValidResetToken(token, 'a@x.com', 'hash-2')).toBe(false);
    expect(isValidResetToken('garbage', 'a@x.com', 'hash-1')).toBe(false);
  });
});
