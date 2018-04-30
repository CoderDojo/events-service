const request = require('supertest');

describe('integration:orders', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the orders that a user has for a certain event', async () => {
    const res = await request(app)
      .get('/orders?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&query[userId]=575fefc6-e9c2-44c8-8e2a-0e1933e6b42e')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results[0].applications.length).to.equal(3);
    expect(res.body.results[0].applications[0].id).to.equal('7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582');
    expect(res.body.results[0].applications[1].id).to.equal('7af9e496-0acd-4f5f-bcfd-2de650ddd48b');
    expect(res.body.results[0].applications[2].id).to.equal('e5993df8-8b3b-4f78-a9e7-77bf12470b98');
  });

  it('should return a 404 error if the event does not exist', async () => {
    await request(app)
      .get('/orders?query[eventId]=5f82f00c-7b47-4ae9-b78b-fc30f471c02f&query[userId]=575fefc6-e9c2-44c8-8e2a-0e1933e6b42e')
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('should return 200 OK if the user does not exist', async () => {
    const res = await request(app)
      .get('/orders?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&query[userId]=a683b89c-8e90-475d-b6a6-38d2597d4445')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.results.length).to.equal(0);
    expect(res.body.total).to.equal(0);
  });
});
