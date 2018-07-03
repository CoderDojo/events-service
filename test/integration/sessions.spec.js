const request = require('supertest');

describe('integration:sessions', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the sessions of an event', async () => {
    const res = await request(app)
      .get('/sessions?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(3);
    expect(res.body.results[0].id).to.equal('e688e464-db01-42fa-b655-5d93fadc3ed8');
    expect(res.body.results[0].eventId).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body.results[0].name).to.equal('Scratch');
    expect(res.body.results[0].description).to.equal('just a description');
    expect(res.body.results[0].status).to.equal('active');
  });

  it('should accept a filtering by status', async () => {
    const res = await request(app)
      .get('/sessions?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&query[status]=active')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results
      .map(s => s.name)
      .filter(name => name === 'Scratch')
      .length).to.equal(1);
  });

  it('should only return specified fields', async () => {
    const res = await request(app)
      .get('/sessions?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&fields=id,eventId')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(3);
    expect(res.body.results[0]).to.deep.equal({
      id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
      eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    });
    expect(res.body.results[1]).to.deep.equal({
      id: '29e7aed3-09b6-44cd-a5be-58a8d41ee61f',
      eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    });
    expect(res.body.results[2]).to.deep.equal({
      id: '0af25c86-b09f-4f71-9a88-dbcb051ab4a0',
      eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    });
  });

  it('should return specified fields with related tickets', async () => {
    const res = await request(app)
      .get('/sessions?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&fields=id,eventId&related=tickets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(3);
    expect(res.body.results[0]).to.deep.equal({
      id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
      eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      tickets: [{
        id: 'ec5037c5-9e09-47b4-bfaf-dcc66892ba1c',
        sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
        name: 'Scratch',
        type: 'mentor',
        quantity: 5,
        deleted: 0,
        invites: [],
      }, {
        id: '6a2d89b1-b154-41b6-9eb4-c8cf55080c5e',
        sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
        name: 'For nobody',
        type: 'mentor',
        quantity: 0,
        deleted: 0,
        invites: [],
      }, {
        id: '58544293-9d1e-4ae0-b061-e005225886b2',
        sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
        name: 'Scratch',
        type: 'ninja',
        quantity: 42,
        deleted: 0,
        invites: [],
      }],
    });
    expect(res.body.results[1]).to.deep.equal({
      id: '29e7aed3-09b6-44cd-a5be-58a8d41ee61f',
      eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      tickets: [{
        id: 'e91533b2-94e7-459c-98fe-a4d95fdc9637',
        sessionId: '29e7aed3-09b6-44cd-a5be-58a8d41ee61f',
        name: 'Web',
        type: 'ninja',
        quantity: 42,
        deleted: 0,
        invites: [],
      }],
    });
    expect(res.body.results[2]).to.deep.equal({
      id: '0af25c86-b09f-4f71-9a88-dbcb051ab4a0',
      eventId: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      tickets: [],
    });
  });
});
