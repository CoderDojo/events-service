const request = require('supertest');

describe('integration:tickets', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the tickets of a session', async () => {
    const res = await request(app)
      .get('/tickets?query[sessionId]=e688e464-db01-42fa-b655-5d93fadc3ed8')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(3);
    expect(res.body.results[0].id).to.equal('ec5037c5-9e09-47b4-bfaf-dcc66892ba1c');
    expect(res.body.results[0].sessionId).to.equal('e688e464-db01-42fa-b655-5d93fadc3ed8');
    expect(res.body.results[0].name).to.equal('Scratch');
    expect(res.body.results[0].type).to.equal('mentor');
    expect(res.body.results[0].quantity).to.equal(5);
    expect(res.body.results[0].invites.length).to.equal(0);
    expect(res.body.results[0].deleted).to.equal(0);

    expect(res.body.results[1].id).to.equal('6a2d89b1-b154-41b6-9eb4-c8cf55080c5e');
    expect(res.body.results[1].sessionId).to.equal('e688e464-db01-42fa-b655-5d93fadc3ed8');
    expect(res.body.results[1].name).to.equal('For nobody');
    expect(res.body.results[1].type).to.equal('mentor');
    expect(res.body.results[1].quantity).to.equal(0);
    expect(res.body.results[1].invites.length).to.equal(0);
    expect(res.body.results[1].deleted).to.equal(0);

    expect(res.body.results[2].id).to.equal('58544293-9d1e-4ae0-b061-e005225886b2');
    expect(res.body.results[2].sessionId).to.equal('e688e464-db01-42fa-b655-5d93fadc3ed8');
    expect(res.body.results[2].name).to.equal('Scratch');
    expect(res.body.results[2].type).to.equal('ninja');
    expect(res.body.results[2].quantity).to.equal(42);
    expect(res.body.results[2].invites.length).to.equal(0);
    expect(res.body.results[2].deleted).to.equal(0);
  });

  it('should accept a filtering', async () => {
    const res = await request(app)
      .get('/tickets?query[sessionId]=e688e464-db01-42fa-b655-5d93fadc3ed8&query[type]=mentor')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results[0]).to.deep.equal({
      id: 'ec5037c5-9e09-47b4-bfaf-dcc66892ba1c',
      sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
      name: 'Scratch',
      type: 'mentor',
      quantity: 5,
      deleted: 0,
      invites: [],
    }, {
      id: '6a2d89b1-b154-41b6-9eb4-c8cf55080c5e',
      session_id: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
      name: 'For nobody',
      type: 'mentor',
      quantity: 0,
      deleted: 0,
      invites: [],
    });
  });

  it('should only return specified fields', async () => {
    const res = await request(app)
      .get('/tickets?query[sessionId]=e688e464-db01-42fa-b655-5d93fadc3ed8&fields=id,sessionId')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(3);
    expect(res.body.results[0]).to.deep.equal({
      id: 'ec5037c5-9e09-47b4-bfaf-dcc66892ba1c',
      sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    });
    expect(res.body.results[1]).to.deep.equal({
      id: '6a2d89b1-b154-41b6-9eb4-c8cf55080c5e',
      sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    });
    expect(res.body.results[2]).to.deep.equal({
      id: '58544293-9d1e-4ae0-b061-e005225886b2',
      sessionId: 'e688e464-db01-42fa-b655-5d93fadc3ed8',
    });
  });
});
