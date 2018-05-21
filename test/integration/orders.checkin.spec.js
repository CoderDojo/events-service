const request = require('supertest');

describe.skip('integration:orders->checkin', () => {
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
    expect(res.body.results[0].applications.length).to.equal(2);
    expect(res.body.results[0].applications[0].id).to.equal('7cc4f1ba-4cfa-47cd-b769-d5bfafc5d582');
    expect(res.body.results[0].applications[1].id).to.equal('7af9e496-0acd-4f5f-bcfd-2de650ddd48b');
    expect(res.body.results[0].applications[0].attendance[0]).to.be.a.date;
    expect(res.body.results[0].applications[1].attendance[0]).to.be.a.date;
    expect(res.body.results[0].applications.map(a => a.id)).to.not.include('e5993df8-8b3b-4f78-a9e7-77bf12470b98');
  });
});
