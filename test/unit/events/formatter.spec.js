const formatter = require('../../../events/formatter');

describe('EventFormatter', () => {
  it('should call format', () => {
    const req = {};
    const res = {
      locals: {
        result: {
          id: 1,
        },
      },
      format: sinon.stub(),
      send: sinon.stub(),
    };
    formatter.format(req, res);
    expect(res.format).to.have.been.calledOnce;
    expect(res.send).to.have.been.calledOnce;
  });
  describe('ICS', () => {
    it('should format a single event into an ics', () => {
      const result = {
        id: 1,
        startTime: new Date(),
        endTime: new Date(),
      };
      const res = formatter.toICS(result);
      expect(res).to.have.match(/PRODID[\s\S]+METHOD[\s\S]+UID[\s\S]+DTSTAMP[\s\S]+DTSTART[\s\S]+DTEND[\s\S]+DESCRIPTION[\s\S]+URL[\s\S]+ORGANIZER[\s\S]+END[\s\S]+/);
      expect(res).to.match(/UID:1@coderdojo.com/);
      expect(res).to.match(/DESCRIPTION:https:\/\/zen\.coderdojo\.com\/events\/1/);
      expect(res).to.match(/URL:https:\/\/zen\.coderdojo.com\/api\/3\.0\/events\/1\.ics/);
    });
    it('should add the geopoint if the event has some', () => {
      const result = {
        id: 1,
        startTime: new Date(),
        endTime: new Date(),
        position: { lat: 1.1, lon: 2.2 },
      };
      const res = formatter.toICS(result);
      expect(res).to.match(/GEO:1.1;2.2/);
    });
  });
});
