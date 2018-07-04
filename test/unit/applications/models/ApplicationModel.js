const proxy = require('proxyquire');

const ApplicationModel = proxy('../../../../applications/models/ApplicationModel', {
  objection: { Model: class { } },
});
describe('ApplicationModel', () => {
  describe('beforeInsert', () => {
    it('should set default value to the application', () => {
      const am = new ApplicationModel();
      am.$beforeInsert({ event: {} });
      expect(am.id).to.not.be.undefined;
      expect(am.status).to.equal('approved');
      expect(am.created instanceof Date).to.be.true;
      expect(am.deleted).to.be.false;
    });
    it('should set the status as pending when the event requires it', () => {
      const am = new ApplicationModel();
      am.$beforeInsert({ event: { ticketApproval: true } });
      expect(am.status).to.equal('pending');
    });
    it('should set the application as deleted if it was', () => {
      const am = new ApplicationModel();
      am.deleted = true;
      am.$beforeInsert({ event: { } });
      expect(am.deleted).to.be.true;
    });
  });
});
