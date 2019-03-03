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
      expect(res).to.have.keys(['productId', 'method', 'uid', 'timestamp', 'start', 'organizer', 'end', 'url']);
      expect(res.uid).to.equal(1);
      expect(res.url).to.equal('https://zen.coderdojo.com/events/1');
    });
  });
});
