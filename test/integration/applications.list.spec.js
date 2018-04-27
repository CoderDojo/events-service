const request = require('supertest');

describe('integration:applications:list', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return every applications for a given eventId', async () => {
    const res = await request(app)
      .get('/applications?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(4);
    expect(res.body.total).to.equal(4);
    expect(res.body.results.map(d => d.deleted)).to.include.members([true, false]);
    expect(res.body.results.map(d => d.status)).to.include.members(['pending', 'approved']);
    expect(res.body.results[0].eventId).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
  });

  // it.should allow a variety of filters

  it('should not return every applications when no params', async () => {
    await request(app)
      .get('/applications')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should only return specified fields', async () => {
    const res = await request(app)
      .get('/applications?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&fields=id,name')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(4);
    expect(res.body.total).to.equal(4);
    expect(res.body.results[0]).to.have.keys(['id', 'name']);
  });

  it('should support page and pageSize', async () => {
    const res = await request(app)
      .get('/applications?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&page=1&pageSize=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results.length).to.equal(1);
    expect(res.body.total).to.equal(4);
  });

  it('should order results by given orderBy field', async () => {
    const res = await request(app)
      .get('/applications?query[eventId]=a60dc59d-2db2-4d5d-a6d3-c08473dee5d4&orderBy=name')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.results[0].name).to.equal('IM BATMAN');
  });
});
