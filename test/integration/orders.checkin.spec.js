const request = require('supertest');

describe('integration:orders->checkin', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should add current date to the applications', async () => {
    const res = await request(app)
      .patch('/orders/642860e5-7f5f-4171-90ce-cc501856b882/checkin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const today = ((new Date().toISOString()).split(':'))[0];
    expect(res.body.applications.length).to.equal(2);
    expect(res.body.applications[0].id).to.equal('7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582');
    expect(res.body.applications[1].id).to.equal('7af9e496-0acd-4f5f-bcfd-2de650ddd48b');
    expect(res.body.applications[0].attendance[0]).to.have.string(today);
    expect(res.body.applications[0].attendance[1]).to.have.string(today);
    expect(res.body.applications[1].attendance[0]).to.have.string(today);
  });
  it('should append for dates recurring events', async () => {
    const res = await request(app)
      .patch('/orders/642860e5-7f5f-4171-90ce-cc501856b882/checkin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const today = ((new Date().toISOString()).split(':'))[0];
    expect(res.body.applications.length).to.equal(2);
    expect(res.body.applications[0].id).to.equal('7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582');
    expect(res.body.applications[0].attendance[2]).to.have.string(today);
    // Because test line:10 adds another one already, it's not 2, but 3 expected
    expect(res.body.applications[0].attendance.length).to.equal(3);
  });
  it('should not touch the cancelled/deleted applications', async () => {
    const res = await request(app)
      .patch('/orders/642860e5-7f5f-4171-90ce-cc501856b882/checkin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.applications.length).to.equal(2);
    expect(res.body.applications.map(a => a.id)).to.not.include('e5993df8-8b3b-4f78-a9e7-77bf12470b98');
    expect(res.body.applications.map(a => a.id)).to.not.include('e8a87127-d315-46cd-b0b9-8d925440b815');
  });
});
