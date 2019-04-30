const request = require('supertest');
const Model = require('../../events/models/EventModel');

describe.only('integration:events:create', () => {
  let app;
  const defaultPayload = {
    name: 'Test Event',
    dojoId: '104b11bf-a844-4e35-ac3b-a95b057b1109',
    type: Model.types.ONE_OFF,
    status: Model.statuses.DRAFT,
    public: true,
    description: '',
    ticketApproval: false,
    notifyOnApplicant: false,
    useDojoAddress: false,
    country: JSON.stringify({}),
    city: JSON.stringify({}),
    position: JSON.stringify({}),
    dates: [],
    sessions: [{
      name: 'Room A Floor 66',
      description: 'a description',
      tickets: [{
        name: 'Ticket 1',
        type: 'ninja',
        quantity: 10,
      }, {
        name: 'Ticket 2',
        type: 'mentor',
        quantity: 3,
      }],
    }],
  };

  beforeEach(() => {
    app = global.app;
  });

  it('should create an event and return its fields', async () => {
    const res = await request(app)
      .post('/events')
      .send(defaultPayload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const eventId = res.body.id;
    const session = res.body.sessions[0];
    expect(res.body).to.contain.keys(Object.keys(defaultPayload));
    expect(eventId).to.exist.and.not.empty;
    expect(session.id).to.exist.and.not.empty;
    expect(session.eventId).to.equal(eventId);
    expect(session.tickets[0].id).to.exist.and.not.empty;
    expect(session.tickets[1].id).to.exist.and.not.empty;
    expect(session.tickets[0].sessionId).to.equal(session.id);
    expect(session.tickets[1].sessionId).to.equal(session.id);
  });
  it('should return 400 if the type is invalid', async () => {
    const payload = Object.assign({}, defaultPayload);
    payload.type = 'forever and ever';
    await request(app)
      .post('/events')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return 400 if the status is invalid', async () => {
    const payload = Object.assign({}, defaultPayload);
    payload.status = 'gone to the bin';
    await request(app)
      .post('/events')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
  it('should return 400 if the status is out of the flow', async () => {
    const payload = Object.assign({}, defaultPayload);
    payload.status = 'cancelled';
    const res = await request(app)
      .post('/events')
      .send(payload)
      .expect(400);
    expect(res.text).to.equal('Invalid status');
  });
  it('should return 400 if the status is out of the flow', async () => {
    const payload = Object.assign({}, defaultPayload);
    payload.type = 'recurring';
    const res = await request(app)
      .post('/events')
      .send(payload)
      .expect(400);
    expect(res.text).to.equal('Recurring events are not implemented (yet)');
  });
});
