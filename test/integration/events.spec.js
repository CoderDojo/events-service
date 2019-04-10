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
    expect(res.body.results[1].sessions[0]).to.not.have.keys(['tickets']);
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
    expect(res.body.results[1].sessions[0].tickets[0]).to.have.keys(['id', 'sessionId', 'name', 'type', 'quantity', 'deleted', 'totalApplications', 'approvedApplications']);
  });

  it('should return the right number of calculated applications per ticket', async () => {
    const res = await request(app)
      .get('/events?query[dojoId]=6dc83174-aad2-4dac-853f-69a0d738cec8&fields=id,dojoId&related=sessions.tickets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect((res.body.results[1].sessions
      .find(s => s.id === 'e688e464-db01-42fa-b655-5d93fadc3ed8'))
      .tickets.find(t => t.id === '58544293-9d1e-4ae0-b061-e005225886b2')
      .totalApplications)
      .to.equal(2);
    expect((res.body.results[1].sessions
      .find(s => s.id === 'e688e464-db01-42fa-b655-5d93fadc3ed8'))
      .tickets.find(t => t.id === '58544293-9d1e-4ae0-b061-e005225886b2')
      .approvedApplications)
      .to.equal(1);
    expect((res.body.results[1].sessions
      .find(s => s.id === '29e7aed3-09b6-44cd-a5be-58a8d41ee61f'))
      .tickets.find(t => t.id === 'e91533b2-94e7-459c-98fe-a4d95fdc9637')
      .totalApplications)
      .to.equal(1);
    expect((res.body.results[1].sessions
      .find(s => s.id === '29e7aed3-09b6-44cd-a5be-58a8d41ee61f'))
      .tickets.find(t => t.id === 'e91533b2-94e7-459c-98fe-a4d95fdc9637')
      .approvedApplications)
      .to.equal(1);
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
  describe('as ICS', () => {
    it('return the ics as a new calendar', async () => {
      const res = await request(app)
        .get('/events?query[dojoId]=95b351c7-8228-4a9d-8fcc-b6b8bf2dd0c2')
        .set('Accept', 'text/calendar')
        .expect('Content-Type', /text\/calendar/)
        .expect(200);
      const attributes = res.text.replace(/\r\n\t/g, '').split('\r\n');
      const fields = [
        'BEGIN:VEVENT',
        'UID:',
        'SUMMARY:',
        /DTSTAMP:[0-9]+T[0-9]+/,
        /DTSTART:[0-9]+T[0-9]+/,
        /DTEND:[0-9]+T[0-9]+/,
        /DESCRIPTION:https:\/\/zen\.coderdojo\.com\/events\/.+/,
        'URL:',
        'ORGANIZER;CN=CoderDojo:mailto:info@coderdojo.com',
        'END:VEVENT',
      ];
      let attributeIndex = 6;
      function testICSEvent(values) {
        fields.forEach((field, index) => {
          let expected = fields[index];
          if (expected.test) {
            expect(attributes[attributeIndex + index]).to.match(expected);
          } else {
            if (values[index]) expected += values[index];
            expect(attributes[attributeIndex + index]).to.equal(expected);
          }
        });
        attributeIndex += fields.length;
      }
      expect(attributes[0]).to.equal('BEGIN:VCALENDAR');
      expect(attributes[1]).to.equal('VERSION:2.0');
      expect(attributes[2]).to.equal('CALSCALE:GREGORIAN');
      expect(attributes[3]).to.equal('PRODID:coderdojo/zen');
      expect(attributes[4]).to.equal('METHOD:PUBLISH');
      expect(attributes[5]).to.equal('X-PUBLISHED-TTL:PT1H');
      testICSEvent([null, '3ae8fc05-55b6-4ea1-ad85-4f385452f764@coderdojo.com', 'Test event 3', null, null, null, null, 'https://zen.coderdojo.com/api/3.0/events/3ae8fc05-55b6-4ea1-ad85-4f385452f764.ics', null]);
      testICSEvent([null, '0e83d8e7-b991-4e4e-b3bd-36aa956f6754@coderdojo.com', 'Test event 4', null, null, null, null, 'https://zen.coderdojo.com/api/3.0/events/0e83d8e7-b991-4e4e-b3bd-36aa956f6754.ics', null]);
      testICSEvent([null, '84c0310e-49ff-4607-99da-a5abb9fb5641@coderdojo.com', 'Test event 5', null, null, null, null, 'https://zen.coderdojo.com/api/3.0/events/84c0310e-49ff-4607-99da-a5abb9fb5641.ics', null]);
      testICSEvent([null, 'bcef18f8-b5ff-43a9-bc2c-7109f6e5dc20@coderdojo.com', 'Test event 6', null, null, null, null, 'https://zen.coderdojo.com/api/3.0/events/bcef18f8-b5ff-43a9-bc2c-7109f6e5dc20.ics', null]);
      testICSEvent([null, '072658b7-cabd-4e31-959b-756b65dec760@coderdojo.com', 'Test event 7', null, null, null, null, 'https://zen.coderdojo.com/api/3.0/events/072658b7-cabd-4e31-959b-756b65dec760.ics', null]);
      expect(attributes[56]).to.equal('END:VCALENDAR');
    });
    it('return an empty calendar', async () => {
      const res = await request(app)
        .get('/events?query[dojoId]=95b351c7-8228-4a9d-8fcc-b6b8bf2ddaaa')
        .set('Accept', 'text/calendar')
        .expect('Content-Type', /text\/calendar/)
        .expect(200);
      const attributes = res.text.replace(/\r\n\t/g, '').split('\r\n');
      expect(attributes[0]).to.equal('BEGIN:VCALENDAR');
      expect(attributes[1]).to.equal('VERSION:2.0');
      expect(attributes[2]).to.equal('CALSCALE:GREGORIAN');
      expect(attributes[3]).to.equal('PRODID:coderdojo/zen');
      expect(attributes[4]).to.equal('METHOD:PUBLISH');
      expect(attributes[5]).to.equal('X-PUBLISHED-TTL:PT1H');
      expect(attributes[6]).to.equal('END:VCALENDAR');
    });
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
