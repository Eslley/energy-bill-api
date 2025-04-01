import request from 'supertest';

import { server } from '../setup';

describe('Sample Test', async () => {
  it('should return 404', async () => {
    const response = await request(server.app).get('/sample');

    expect(response.status).toBe(404);
  });
});
