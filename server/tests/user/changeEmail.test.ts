import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

const store = {
  user: null as any,
  otps: [] as any[],
  taken: new Set<string>(),
  sent: [] as { to: string; code?: number; kind: string }[],
};

jest.mock('../../src/models/user', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(() => {
      const doc = store.user;
      const result: any = Promise.resolve(doc);
      result.populate = () => Promise.resolve({ toObject: () => ({ ...doc }) });
      return result;
    }),
    exists: jest.fn(async (q: any) => (store.taken.has(q.email) ? { _id: 'x' } : null)),
  },
}));
jest.mock('../../src/models/otp', () => ({
  __esModule: true,
  default: {
    deleteMany: jest.fn(async () => ((store.otps = []), {})),
    create: jest.fn(async (doc: any) => store.otps.push(doc)),
    findOne: jest.fn(async (q: any) => store.otps.find((o) => o.email === q.email && o.purpose === q.purpose) ?? null),
  },
}));
jest.mock('../../src/utils/sendEmail', () => ({
  sendOTPEmail: jest.fn(async (to: string, _name: string, code: number) => (store.sent.push({ to, code, kind: 'otp' }), { success: true })),
  sendEmailChangedEmail: jest.fn(async (to: string) => (store.sent.push({ to, kind: 'changed' }), { success: true })),
}));

import { confirmEmailChange, requestEmailChange } from '../../src/controllers/user/changeEmail';

const call = async (handler: any, body: any) => {
  const res: any = { statusCode: 200, body: null };
  res.status = (c: number) => ((res.statusCode = c), res);
  res.json = (b: any) => ((res.body = b), res);
  await handler({ body, user: { id: 'u1' } } as unknown as Request, res as Response, jest.fn() as NextFunction);
  return res;
};

beforeEach(() => {
  store.user = { _id: 'u1', name: 'Alice', email: 'old@x.com', password: bcrypt.hashSync('pw', 4), save: jest.fn() };
  store.otps = [];
  store.taken = new Set(['old@x.com', 'bob@x.com']);
  store.sent = [];
});

describe('change email', () => {
  it('requires the current password and an unused, valid address', async () => {
    expect((await call(requestEmailChange, { newEmail: 'new@x.com', password: 'wrong' })).statusCode).toBe(400);
    expect((await call(requestEmailChange, { newEmail: 'not-an-email', password: 'pw' })).statusCode).toBe(400);
    expect((await call(requestEmailChange, { newEmail: 'bob@x.com', password: 'pw' })).statusCode).toBe(409);
    expect(store.sent).toHaveLength(0);
  });

  it('sends a code to the new address and switches only with the right code', async () => {
    const req = await call(requestEmailChange, { newEmail: ' New@X.com ', password: 'pw' });
    expect(req.statusCode).toBe(200);
    const { to, code } = store.sent[0];
    expect(to).toBe('new@x.com');

    expect((await call(confirmEmailChange, { newEmail: 'new@x.com', otp: '000000' })).statusCode).toBe(400);
    expect(store.user.email).toBe('old@x.com');

    const ok = await call(confirmEmailChange, { newEmail: 'new@x.com', otp: String(code) });
    expect(ok.statusCode).toBe(200);
    expect(store.user.email).toBe('new@x.com');
    expect(ok.body.user.password).toBeUndefined();
    expect(store.sent.find((s) => s.kind === 'changed')?.to).toBe('old@x.com');
  });
});
