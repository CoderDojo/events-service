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
});
