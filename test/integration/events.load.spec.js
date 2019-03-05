const request = require('supertest');

describe('integration:events:load', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the event by id', async () => {
    const res = await request(app)
      .get('/events/a5d60790-17c4-4a86-a023-d1558b06f118')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body).to.have.all.keys(['id', 'name', 'dates', 'address', 'city', 'country', 'createdAt', 'createdBy', 'description', 'dojoId', 'endTime', 'eventbriteId', 'eventbriteUrl', 'notifyOnApplicant', 'position', 'public', 'recurringType', 'startTime', 'status', 'ticketApproval', 'type', 'useDojoAddress']);
  });
  it('should accept a restriction on fields', async () => {
    const res = await request(app)
      .get('/events/a5d60790-17c4-4a86-a023-d1558b06f118?fields=id,name,dates')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body).to.have.all.keys(['id', 'name', 'dates']);
  });
  it('should allow to eager load sessions', async () => {
    const res = await request(app)
      .get('/events/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4?related=sessions&fields=id,name')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body).to.have.all.keys(['id', 'name', 'sessions']);
    expect(res.body.sessions[0]).to.have.all.keys(['id', 'eventId', 'name', 'description', 'status']);
  });
  it('should return the right date for startTime of a recurring event', async () => {
    const res = await request(app)
      .get('/events/a5d60790-17c4-4a86-a023-d1558b06f118?related=sessions.tickets&query[afterDate]=1519554298&query[utcOffset]=0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body).to.include.all.keys(['id', 'name', 'sessions', 'startTime', 'endTime', 'dates']);
    expect(res.body.startTime).to.equal('2018-03-01T13:00:00.000Z');
    expect(res.body.endTime).to.equal('2018-03-01T15:00:00.000Z');
  });
  it('should allow to eager load sessions and tickets', async () => {
    const res = await request(app)
      .get('/events/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4?related=sessions.tickets&fields=id,name')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(res.body.id).to.equal('a60dc59d-2db2-4d5d-a6d3-c08473dee5d4');
    expect(res.body).to.have.all.keys(['id', 'name', 'sessions']);
    expect(res.body.sessions[0]).to.have.all.keys(['id', 'eventId', 'name', 'description', 'status', 'tickets']);
  });
  describe('when ICS', () => {
    it('should return an ics when specifying the format by header', async () => {
      const res = await request(app)
        .get('/events/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4')
        .set('Accept', 'text/calendar')
        .expect('Content-Type', /text\/calendar/)
        .expect(200);
      const attributes = res.text.replace(/\r\n\t/g, '').split('\r\n');
      let attrIt = 1;
      expect(attributes[0]).to.equal('BEGIN:VCALENDAR');
      /* eslint-disable no-plusplus */
      expect(attributes[attrIt++]).to.equal('VERSION:2.0');
      expect(attributes[attrIt++]).to.equal('CALSCALE:GREGORIAN');
      expect(attributes[attrIt++]).to.equal('PRODID:coderdojo/zen');
      expect(attributes[attrIt++]).to.equal('METHOD:PUBLISH');
      expect(attributes[attrIt++]).to.equal('X-PUBLISHED-TTL:PT1H');
      expect(attributes[attrIt++]).to.equal('BEGIN:VEVENT');
      expect(attributes[attrIt++]).to.equal('UID:a60dc59d-2db2-4d5d-a6d3-c08473dee5d4@coderdojo.com');
      expect(attributes[attrIt++]).to.equal('SUMMARY:Test event 1');
      expect(attributes[attrIt++]).to.match(/DTSTAMP:[0-9]+T[0-9]+/);
      expect(attributes[attrIt++]).to.match(/DTSTART:[0-9]+T[0-9]+/);
      expect(attributes[attrIt++]).to.match(/DTEND:[0-9]+T[0-9]+/);
      expect(attributes[attrIt++]).to.match(/DESCRIPTION:https:\/\/zen\.coderdojo\.com\/events\/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4\\n null/);
      expect(attributes[attrIt++]).to.equal('URL:https://zen.coderdojo.com/api/3.0/events/a60dc59d-2db2-4d5d-a6d3-c08473dee5d4.ics');
      expect(attributes[attrIt++]).to.equal('ORGANIZER;CN=CoderDojo:mailto:info@coderdojo.com');
      expect(attributes[attrIt++]).to.equal('END:VEVENT');
      expect(attributes[attrIt++]).to.equal('END:VCALENDAR');
      /* eslint-enable no-plusplus */
    });
  });
});

