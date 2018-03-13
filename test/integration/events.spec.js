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

  it('should support page and pageSize', async () => {
    const res1 = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&fields=id,dojoId&page=1&pageSize=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res1.body.results.length).to.equal(1);
    expect(res1.body.results[0]).to.deep.equal({
      id: 'a5d60790-17c4-4a86-a023-d1558b06f118',
      dojoId: '6dc83174-aad2-4dac-853f-69a0d738cec8',
    });
    const res2 = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&fields=id,dojoId&page=2&pageSize=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res2.body.results.length).to.equal(1);
    expect(res2.body.results[0]).to.deep.equal({
      id: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
      dojoId: '6dc83174-aad2-4dac-853f-69a0d738cec8',
    });
  });

  it('should return a 400 if afterDate is provided without a utcOffset', async () => {
    await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&query[afterDate]=1519554298')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
