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
    expect(res.body.results[0].applications.length).to.equal(2);
    expect(res.body.results[0].applications[0].id).to.equal('7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582');
    expect(res.body.results[0].applications[1].id).to.equal('7af9e496-0acd-4f5f-bcfd-2de650ddd48b');
    expect(res.body.results[0].applications.map(a => a.id)).to.not.include('e5993df8-8b3b-4f78-a9e7-77bf12470b98');
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

  it('should return all components of an order with values that correspond to the body of the request', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        userId: 'eb384c15-4032-4e0a-84a1-931382f6fac6',
        applications: [{
          id: '9c56d4ac-7dbc-4b71-897c-15fcb14639d1',
          eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
          name: 'Scooby doo',
          dateOfBirth: '2017-10-01',
          status: 'approved',
          userId: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
          ticketName: 'Scratch',
          ticketType: 'ninja',
          sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
          dojoId: 'bbaf1cf2-328a-43bb-9e20-8c9c25dbbefc',
          ticketId: '58544293-9d1e-4ae0-b061-e005225886b2',
        },
        {
          id: '0b9f163e-1705-4bd7-bfbc-a643662b3346',
          eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
          name: 'Scrappy doo',
          dateOfBirth: '2017-10-01',
          status: 'pending',
          userId: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
          ticketName: 'Scratch',
          ticketType: 'ninja',
          sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
          dojoId: 'bbaf1cf2-328a-43bb-9e20-8c9c25dbbefc',
          ticketId: '58544293-9d1e-4ae0-b061-e005225886b2',
        }],
        eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.id).exist;
    expect(res.body.createdAt).exist;
    expect(res.body.eventId).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body.userId).to.equal('eb384c15-4032-4e0a-84a1-931382f6fac6');
    expect(res.body.applications[0]).to.have.all.keys(['id', 'eventId', 'name', 'dateOfBirth',
      'status', 'userId', 'ticketName',
      'ticketType', 'sessionId', 'dojoId',
      'ticketId', 'orderId']);
    expect(res.body.applications[1]).to.have.keys(['id', 'eventId', 'name', 'dateOfBirth',
      'status', 'userId', 'ticketName',
      'ticketType', 'sessionId', 'dojoId',
      'ticketId', 'orderId']);
    expect(res.body.applications[0].id).to.equal('9c56d4ac-7dbc-4b71-897c-15fcb14639d1');
    expect(res.body.applications[1].id).to.equal('0b9f163e-1705-4bd7-bfbc-a643662b3346');
    expect(res.body.applications[0].ticketId).to.equal('58544293-9d1e-4ae0-b061-e005225886b2');
    expect(res.body.applications[1].ticketId).to.equal('58544293-9d1e-4ae0-b061-e005225886b2');
    expect(res.body.applications[0].orderId).exist;
    expect(res.body.applications[1].orderId).exist;
  });
  it('should return 400 if userId and/or applications and/or eventId is/are not valid', async () => {
    await request(app)
      .post('/orders')
      .send({
        userId: '1234',
        applications: [],
        eventId: '1234',
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
  it('should return 400 if any item in an application object is not valid', async () => {
    await request(app)
      .post('/orders')
      .send({
        userId: 'eb384c15-4032-4e0a-84a1-931382f6fac6',
        applications: [{
          id: '1234556',
          eventId: '123455',
          name: 'Scooby doo',
          dateOfBirth: '2017-10-01',
          status: 'blahblah',
          userId: '24235235',
          ticketName: 'Scratch',
          ticketType: 'ninja',
          sessionId: '345345',
          dojoId: '345345',
          ticketId: '345345',
        }],
        eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
});
