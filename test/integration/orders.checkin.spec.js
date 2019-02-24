const request = require('supertest');

describe('integration:orders->checkin', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should add current date to the application', async () => {
    const res = await request(app)
      .patch('/orders/3a9413a5-0399-42c2-b0c1-e2d384600e87/checkin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const today = ((new Date().toISOString()).split(':'))[0];
    expect(res.body.applications.length).to.equal(1);
    expect(res.body.applications[0].id).to.equal('2c5ca980-0c79-43a2-8ae0-7f62e0b82d5e');
    expect(res.body.applications[0].attendance[0]).to.have.string(today);
    expect(res.body.applications[0].attendance.length).to.equal(1);
  });
  it('should append dates if checked-in multiple times to support recurring events', async () => {
    const res = await request(app)
      .patch('/orders/a57baaf8-cf99-4470-b078-b7e822d22288/checkin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    const today = ((new Date().toISOString()).split(':'))[0];
    expect(res.body.applications.length).to.equal(1);
    expect(res.body.applications[0].id).to.equal('4d59fba3-9555-4dd0-869b-5ad77e5ef749');
    expect(res.body.applications[0].attendance[1]).to.have.string(today);
    expect(res.body.applications[0].attendance.length).to.equal(2);
  });
  it('should not touch the cancelled/deleted applications', async () => {
    const res = await request(app)
      .patch('/orders/642860e5-7f5f-4171-90ce-cc501856b882/checkin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    console.log(res.body);
    expect(res.body.applications.length).to.equal(2);

    expect(res.body.applications[0].id).to.equal('7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582');
    expect(res.body.applications[1].id).to.equal('7af9e496-0acd-4f5f-bcfd-2de650ddd48b');
    expect(res.body.applications.map(a => a.id)).to.not.include('e8a87127-d315-46cd-b0b9-8d925440b815');
    expect(res.body.applications.map(a => a.id)).to.not.include('e5993df8-8b3b-4f78-a9e7-77bf12470b98');
  });
  it('should return 404 if the order doesnt exists', async () => {
    await request(app)
      .patch('/orders/e4a65856-8cc2-41f6-8ca5-ed1bfbceb82e/checkin')
      .set('Accept', 'application/json')
      .expect(404);
  });
});
