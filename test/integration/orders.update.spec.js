const request = require('supertest');

describe('integration:orders->update', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should replace an order\'s applications', async () => {
    const res = await request(app)
      .put('/orders/642860e5-7f5f-4171-90ce-cc501856b882')
      .send({
        applications: [{
          eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
          name: 'Cloack',
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
          eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
          name: 'Dagger',
          dateOfBirth: '2017-10-01',
          status: 'pending',
          userId: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
          ticketName: 'Scratch',
          ticketType: 'ninja',
          sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
          dojoId: 'bbaf1cf2-328a-43bb-9e20-8c9c25dbbefc',
          ticketId: '58544293-9d1e-4ae0-b061-e005225886b2',
        }],
      })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.id).to.equal('642860e5-7f5f-4171-90ce-cc501856b882');
    expect(res.body.createdAt).exist;
    expect(res.body.eventId).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body.userId).to.equal('575fefc6-e9c2-44c8-8e2a-0e1933e6b42e');
    expect(res.body.applications.length).to.equal(2);
    expect(res.body.applications[0]).to.have.all.keys(['id', 'eventId', 'name', 'dateOfBirth',
      'status', 'userId', 'ticketName',
      'ticketType', 'sessionId', 'dojoId',
      'ticketId', 'orderId', 'attendance', 'notes', 'created', 'deleted']);
    expect(res.body.applications[1]).to.have.keys(['id', 'eventId', 'name', 'dateOfBirth',
      'status', 'userId', 'ticketName',
      'ticketType', 'sessionId', 'dojoId',
      'ticketId', 'orderId', 'attendance', 'notes', 'created', 'deleted']);
    expect(res.body.applications[0].ticketId).to.equal('58544293-9d1e-4ae0-b061-e005225886b2');
    expect(res.body.applications[1].ticketId).to.equal('58544293-9d1e-4ae0-b061-e005225886b2');
    expect(res.body.applications[0].orderId).to.equal('642860e5-7f5f-4171-90ce-cc501856b882');
    expect(res.body.applications[1].orderId).to.equal('642860e5-7f5f-4171-90ce-cc501856b882');
    expect(res.body.applications[0].name).to.equal('Cloack');
    expect(res.body.applications[1].name).to.equal('Dagger');
    expect(res.body.applications[0].status).to.equal('approved');
    expect(res.body.applications[1].status).to.equal('approved');
  });
  it('should return a status of 400 if applications is not valid', async () => {
    await request(app)
      .put('/orders/642860e5-7f5f-4171-90ce-cc501856b882')
      .send({
        applications: [],
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
  it('should return a status of 400 if any item in the applications object is not valid', async () => {
    await request(app)
      .put('/orders/642860e5-7f5f-4171-90ce-cc501856b882')
      .send({
        applications: [{
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
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
  it('should return a status of 409 if there are no tickets available', async () => {
    await request(app)
      .put('/orders/642860e5-7f5f-4171-90ce-cc501856b882')
      .send({
        applications: [{
          eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
          name: 'Cloack',
          dateOfBirth: '2017-10-01',
          status: 'approved',
          userId: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
          ticketName: 'Scratch',
          ticketType: 'ninja',
          sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
          dojoId: 'bbaf1cf2-328a-43bb-9e20-8c9c25dbbefc',
          ticketId: '6a2d89b1-b154-41b6-9eb4-c8cf55080c5e',
        }],
      })
      .set('Accept', 'application/json')
      .expect(409);
  });
});
