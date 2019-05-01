const proxy = require('proxyquire');

const TicketModel = proxy('../../../../tickets/models/TicketModel', {
  objection: {
    Model: class {
      // eslint-disable-next-line class-methods-use-this
      $beforeInsert() {}
    },
  },
});
describe('TicketModel', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.restore();
  });
  describe('TYPES', () => {
    it('should return an object with 3 values', () => {
      expect(Object.entries(TicketModel.TYPES)).eql([
        ['NINJA', 'ninja'],
        ['MENTOR', 'mentor'],
        ['PARENT', 'parent-guardian'],
      ]);
    });
  });
  describe('$beforeInsert', () => {
    it('should set sensible defaults', async () => {
      const model = new TicketModel();
      await model.$beforeInsert();
      expect(model.id).to.exist;
    });
  });

  describe('namedFilters', () => {
    it('should return 5 filters', () => {
      expect(Object.keys(TicketModel.namedFilters)).to.eql(['active', 'inactive', 'publicFields', 'totalApplications', 'approvedApplications']);
      expect(TicketModel.namedFilters.active).to.be.a('function');
      expect(TicketModel.namedFilters.inactive).to.be.a('function');
      expect(TicketModel.namedFilters.publicFields).to.be.a('function');
      expect(TicketModel.namedFilters.totalApplications).to.be.a('function');
      expect(TicketModel.namedFilters.approvedApplications).to.be.a('function');
    });
    it('should define the active filter', () => {
      const filter = TicketModel.namedFilters.active;
      const builder = {
        where: sandbox.stub(),
      };
      filter(builder);
      expect(builder.where).to.have.been.calledOnce
        .and.calledWith('deleted', '=', 0);
    });
    it('should define the inactive filter', () => {
      const filter = TicketModel.namedFilters.inactive;
      const builder = {
        where: sandbox.stub(),
      };
      filter(builder);
      expect(builder.where).to.have.been.calledOnce
        .and.calledWith('deleted', '=', 1);
    });
    it('should define the totalApplications filter', () => {
      const filter = TicketModel.namedFilters.totalApplications;
      const builder = {
        select: sandbox.stub().returnsThis(),
      };
      TicketModel.relatedQuery = sandbox.stub().returnsThis();
      TicketModel.applyFilter = sandbox.stub().returnsThis();
      TicketModel.count = sandbox.stub().returnsThis();
      TicketModel.as = sandbox.stub().returnsThis();
      filter(builder);
      expect(builder.select).to.have.been.calledOnce
        .and.calledWith(TicketModel);
      expect(TicketModel.relatedQuery).to.have.been.calledOnce
        .and.calledWith('applications');
      expect(TicketModel.applyFilter).to.have.been.calledOnce
        .and.calledWith('awaiting');
      expect(TicketModel.count).to.have.been.calledOnce
        .and.calledWith();
      expect(TicketModel.as).to.have.been.calledOnce
        .and.calledWith('totalApplications');
    });
    it('should define the approvedApplications filter', () => {
      const filter = TicketModel.namedFilters.approvedApplications;
      const builder = {
        select: sandbox.stub().returnsThis(),
      };
      TicketModel.relatedQuery = sandbox.stub().returnsThis();
      TicketModel.applyFilter = sandbox.stub().returnsThis();
      TicketModel.count = sandbox.stub().returnsThis();
      TicketModel.as = sandbox.stub().returnsThis();
      filter(builder);
      expect(builder.select).to.have.been.calledOnce
        .and.calledWith(TicketModel);
      expect(TicketModel.relatedQuery).to.have.been.calledOnce
        .and.calledWith('applications');
      expect(TicketModel.applyFilter).to.have.been.calledOnce
        .and.calledWith('booked');
      expect(TicketModel.count).to.have.been.calledOnce
        .and.calledWith();
      expect(TicketModel.as).to.have.been.calledOnce
        .and.calledWith('approvedApplications');
    });
    it('should define the publicFields filter', () => {
      const filter = TicketModel.namedFilters.publicFields;
      const builder = {
        select: sandbox.stub(),
      };
      filter(builder);
      expect(builder.select).to.have.been.calledOnce
        .and.calledWith('id', 'sessionId', 'name', 'type', 'quantity', 'deleted');
    });
  });
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
