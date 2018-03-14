const request = require('supertest');

describe('integration:events', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the next occurences of events from a given dojoId', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results[0].id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body.results[0].dojoId).to.equal('6dc83174-aad2-4dac-853f-69a0d738cec8');
    expect(res.body.results[0].startTime).to.equal('2018-02-22T13:00:00.000Z');
    expect(res.body.results[0].dates.length).to.equal(4);
    expect(res.body.results[1].id).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body.results[1].dojoId).to.equal('6dc83174-aad2-4dac-853f-69a0d738cec8');
    expect(res.body.results[1].dates.length).to.equal(1);
    expect(res.body.results[1].startTime).to.equal('2018-02-28T18:00:00.000Z');
  });

  it('should return the next occurences of events from a given dojoId after the given timestamp', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&query[afterDate]=1519554298&query[utcOffset]=0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results[0].id).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body.results[0].dojoId).to.equal('6dc83174-aad2-4dac-853f-69a0d738cec8');
    expect(res.body.results[0].dates.length).to.equal(1);
    expect(res.body.results[0].startTime).to.equal('2018-02-28T18:00:00.000Z');
    expect(res.body.results[1].id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body.results[1].dojoId).to.equal('6dc83174-aad2-4dac-853f-69a0d738cec8');
    expect(res.body.results[1].startTime).to.equal('2018-03-01T13:00:00.000Z');
    expect(res.body.results[1].dates.length).to.equal(4);
  });

  it('should only return specified fields', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&fields=id,dojoId')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results[0]).to.deep.equal({
      id: 'a5d60790-17c4-4a86-a023-d1558b06f118',
      dojoId: '6dc83174-aad2-4dac-853f-69a0d738cec8',
    });
    expect(res.body.results[1]).to.deep.equal({
      id: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      dojoId: '6dc83174-aad2-4dac-853f-69a0d738cec8',
    });
  });

  it('should return active sessions and selected fields', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&fields=id,dojoId&related=sessions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results[0]).to.have.keys(['id', 'dojoId', 'sessions']);
    expect(res.body.results[0].sessions.length).to.equal(0);
    expect(res.body.results[1]).to.have.keys(['id', 'dojoId', 'sessions']);
    expect(res.body.results[1].sessions.length).to.equal(2);
  });

  it('should return active sessions as well as tickets', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&fields=id,dojoId&related=sessions.tickets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(2);
    expect(res.body.results[0]).to.have.keys(['id', 'dojoId', 'sessions']);
    expect(res.body.results[0].sessions.length).to.equal(0);
    expect(res.body.results[1]).to.have.keys(['id', 'dojoId', 'sessions']);
    expect(res.body.results[1].sessions.length).to.equal(2);
    expect(res.body.results[1].sessions.map(s => s.tickets).length).to.equal(2);
    expect(res.body.results[1].sessions[0].tickets[0]).to.have.keys(['id', 'sessionId', 'name', 'type', 'quantity', 'deleted']);
  });

  it('should support page and pageSize', async () => {
    const res1 = await request(app)
      .get('/events?query[dojoId]=95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2&fields=id,dojoId&page=1&pageSize=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res1.body.results.length).to.equal(3);
    expect(res1.body.results[0]).to.deep.equal({
      id: '3ae8fc05-55b6-4ea1-ad85-4f385452f764',
      dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    });
    expect(res1.body.results[1]).to.deep.equal({
      id: '0e83d8e7-b991-4e4e-b3bd-36aa956f6754',
      dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    });
    expect(res1.body.results[2]).to.deep.equal({
      id: '84c0310e-49ff-4607-99da-a5abb9fb5641',
      dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    });
    const res2 = await request(app)
      .get('/events?query[dojoId]=95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2&fields=id,dojoId&page=2&pageSize=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res2.body.results.length).to.equal(2);
    expect(res2.body.results[0]).to.deep.equal({
      id: 'bcef18f8-b5ff-43a9-bc2c-7109f6e5dc20',
      dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    });
    expect(res2.body.results[1]).to.deep.equal({
      id: '072658b7-cabd-4e31-959b-756b65dec760',
      dojoId: '95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2',
    });
  });

  it('should order results by given orderBy field', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2&orderBy=id')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(5);
    expect(res.body.results[0].id).to.equal('072658b7-cabd-4e31-959b-756b65dec760');
    expect(res.body.results[0].startTime).to.equal('2018-05-23T10:00:00.000Z');
    expect(res.body.results[1].id).to.equal('0e83d8e7-b991-4e4e-b3bd-36aa956f6754');
    expect(res.body.results[1].startTime).to.equal('2018-05-02T10:00:00.000Z');
    expect(res.body.results[2].id).to.equal('3ae8fc05-55b6-4ea1-ad85-4f385452f764');
    expect(res.body.results[2].startTime).to.equal('2018-04-25T10:00:00.000Z');
    expect(res.body.results[3].id).to.equal('84c0310e-49ff-4607-99da-a5abb9fb5641');
    expect(res.body.results[3].startTime).to.equal('2018-05-09T10:00:00.000Z');
    expect(res.body.results[4].id).to.equal('bcef18f8-b5ff-43a9-bc2c-7109f6e5dc20');
    expect(res.body.results[4].startTime).to.equal('2018-05-16T10:00:00.000Z');
  });

  it('should return a 400 if afterDate is provided without a utcOffset', async () => {
    await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&query[afterDate]=1519554298')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return a 400 if dojoId is not provided', async () => {
    await request(app)
      .get('/events?query[afterDate]=1519554298&utcOffset=0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return a 400 if dojoId is not a uuid', async () => {
    await request(app)
      .get('/events?query[dojoId]=foo')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
