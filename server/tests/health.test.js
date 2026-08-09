const request = require('supertest');
const app = require('../index');
describe('health', () => {
  it('returns service status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
  it('returns consistent 404 errors', async () => {
    const response = await request(app).get('/api/not-a-route');
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
