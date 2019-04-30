const proxy = require('proxyquire');

const SessionModel = proxy('../../../../sessions/models/SessionModel', {
  objection: {
    Model: class {
      // eslint-disable-next-line class-methods-use-this
      $beforeInsert() {}
    },
  },
});
describe.only('SessionModel', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.restore();
  });
  describe('statuses', () => {
    it('should return an object with 2 values', () => {
      expect(Object.entries(SessionModel.STATUSES)).eql([
        ['ACTIVE', 'active'],
        ['CANCELLED', 'cancelled'],
      ]);
    });
  });

  describe('namedFilters', () => {
    it('should return 2 filters', () => {
      expect(Object.keys(SessionModel.namedFilters)).to.eql(['active', 'inactive']);
      expect(SessionModel.namedFilters.active).to.be.a('function');
      expect(SessionModel.namedFilters.inactive).to.be.a('function');
    });
    it('should define the active filter', () => {
      const filter = SessionModel.namedFilters.active;
      const builder = {
        where: sandbox.stub(),
      };
      filter(builder);
      expect(builder.where).to.have.been.calledOnce
        .and.calledWith('status', '=', 'active');
    });
    it('should define the inactive filter', () => {
      const filter = SessionModel.namedFilters.inactive;
      const builder = {
        where: sandbox.stub(),
      };
      filter(builder);
      expect(builder.where).to.have.been.calledOnce
        .and.calledWith('status', '=', 'cancelled');
    });
  });
  describe('$beforeInsert', () => {
    it('should set sensible defaults', async () => {
      const model = new SessionModel();
      await model.$beforeInsert();
      expect(model.id).to.exist;
      expect(model.status).to.equal('active');
    });
    it('should always overwrite the status to active on insert', async () => {
      const model = new SessionModel();
      model.status = 'banana';
      await model.$beforeInsert();
      expect(model.id).to.exist;
      expect(model.status).to.equal('active');
    });
  });
});
