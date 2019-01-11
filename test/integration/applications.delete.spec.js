const request = require('supertest');

describe('integration:applications', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  describe('delete', () => {
    it('should return 200 on found application', async () => {
      const res = await request(app)
        .delete('/applications/adf825db-ef01-42ec-a334-a5a534f512fa')
        .expect(200);
    });
    it('should allow for soft-delete', async () => {
      const res = await request(app)
        .delete('/applications/8b3b0f34-230b-49d2-8c2c-aaa6d3122539')
        .send({ soft: true })
        .expect(200);
    });
    it('should return 404 on non-existing id', async () => {
      const res = await request(app)
        .delete('/applications/adf825db-ef01-42ec-a334-a5a534f51666')
        .expect(404);
    });
  });
});
