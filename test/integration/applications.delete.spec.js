const request = require('supertest');

describe('integration:applications', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  describe('delete', () => {
    it('should return 204 on found application', async () => {
      await request(app)
        .delete('/applications/adf825db-ef01-42ec-a334-a5a534f512fa')
        .expect(204);
    });
    it('should allow for soft-delete', async () => {
      await request(app)
        .delete('/applications/8b3b0f34-230b-49d2-8c2c-aaa6d3122539')
        .send({ soft: true })
        .expect(204);
    });
    it('should return 404 on non-existing id', async () => {
      await request(app)
        .delete('/applications/adf825db-ef01-42ec-a334-a5a534f51666')
        .expect(404);
    });
  });
});
