const request = require('supertest');

describe('integration:users:applications', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  describe('delete', () => {
    it('should return 204 on found application', async () => {
      await request(app)
        .delete('/users/6bb57330-4bad-4909-9f9e-fbb2ad3c72e2/applications')
        .expect(204);
      const res = await request(app)
        .get('/applications?query[userId]=6bb57330-4bad-4909-9f9e-fbb2ad3c72e2')
        .expect(200);
      expect(res.body.results.length).to.equal(0);
    });
    it('should allow for soft-delete', async () => {
      await request(app)
        .delete('/users/7f93998e-bff4-472b-8183-7026489701c7/applications')
        .send({ soft: true })
        .expect(204);
      const res = await request(app)
        .get('/applications?query[userId]=7f93998e-bff4-472b-8183-7026489701c7')
        .expect(200);
      expect(res.body.results.length).to.equal(0);
    });
    it('should return 404 on non-existing id', async () => {
      await request(app)
        .delete('/applications/adf825db-ef01-42ec-a334-a5a534f51666')
        .expect(404);
    });
  });
});
