import request from 'supertest';
import app from '../index.js';

describe('GET /', () => {
  it('responds with Hello world', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.text).toBe('Hello world!');
  });
})``;
