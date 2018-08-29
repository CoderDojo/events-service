const proxy = require('proxyquire');

const TicketModel = proxy('../../../../tickets/models/TicketModel', {
  objection: { Model: class { } },
});
describe('TicketModel', () => {
  describe('hasCapacityFor', () => {
    it('should return true if the totalApplication + new ones is less than the quantity', () => {
      const am = new TicketModel();
      am.quantity = 3;
      am.totalApplications = 1;
      expect(am.hasCapacityFor(2)).to.be.true;
    });
    it('should return true if the ticket is a parent ticket, even if overbooked', () => {
      const am = new TicketModel();
      am.quantity = 1;
      am.totalApplications = 2;
      am.type = 'parent-guardian';
      expect(am.hasCapacityFor(1)).to.be.true;
    });
    it('should throw an error on overflow', () => {
      const am = new TicketModel();
      am.quantity = 3;
      am.totalApplications = 2;
      expect(() => am.hasCapacityFor(2)).to.throw('Not enough capacity');
    });
  });
});
