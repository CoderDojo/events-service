const request = require('supertest');

describe('integration:applications', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  describe('list', () => {
    it('should return all applications for an userId', async () => {
      const res = await request(app)
        .get('/applications?query[userId]=575fefc6-e9c2-44c8-8e2a-0e1933e6b42e')
        .expect(200);
      expect(res.body.results.length).to.equal(4); // All but deleted
      expect(res.body.results[0]).to.have.keys(['id', 'eventId', 'name', 'dateOfBirth', 'status', 'userId', 'ticketName', 'ticketType', 'sessionId', 'created', 'deleted', 'attendance', 'dojoId', 'ticketId', 'notes', 'orderId']);
    });
    it('should return 404 on lack of data', async () => {
      const res = await request(app)
        .get('/applications?query[userId]=575fefc6-e9c2-44c8-8e2a-0e1933e6b666')
        .expect(404);
    });
  });
});
