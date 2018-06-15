const request = require('supertest');

describe('integration:events:load', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the event by id', async () => {
    const res = await request(app)
      .get('/events/a5d60790-17c4-4a86-a023-d1558b06f118')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body).to.have.all.keys(['id', 'name', 'dates', 'address', 'city', 'country', 'createdAt', 'createdBy', 'description', 'dojoId', 'endTime', 'eventbriteId', 'eventbriteUrl', 'notifyOnApplicant', 'position', 'public', 'recurringType', 'startTime', 'status', 'ticketApproval', 'type', 'useDojoAddress']);
  });
  it('should accept a restriction on fields', async () => {
    const res = await request(app)
      .get('/events/a5d60790-17c4-4a86-a023-d1558b06f118?fields=id,name,dates')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body).to.have.all.keys(['id', 'name', 'dates']);
  });
  it('should allow to eager load sessions', async () => {
    const res = await request(app)
      .get('/events/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4?related=sessions&fields=id,name')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body).to.have.all.keys(['id', 'name', 'sessions']);
    expect(res.body.sessions[0]).to.have.all.keys(['id', 'eventId', 'name', 'description', 'status']);
  });
  it('should return the right date for startTime of a recurring event', async () => {
    const res = await request(app)
      .get('/events/a5d60790-17c4-4a86-a023-d1558b06f118?related=sessions.tickets&query[afterDate]=1519554298&query[utcOffset]=0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body).to.include.all.keys(['id', 'name', 'sessions', 'startTime', 'endTime', 'dates']);
    expect(res.body.startTime).to.equal('2018-03-01T13:00:00.000Z');
    expect(res.body.endTime).to.equal('2018-03-01T15:00:00.000Z');
  });
  it('should allow to eager load sessions and tickets', async () => {
    const res = await request(app)
      .get('/events/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4?related=sessions.tickets&fields=id,name')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body).to.have.all.keys(['id', 'name', 'sessions']);
    expect(res.body.sessions[0]).to.have.all.keys(['id', 'eventId', 'name', 'description', 'status', 'tickets']);
  });
});

