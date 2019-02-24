const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const OrdersControllerInstance = {};
const TicketsControllerInstance = {};
const ApplicationsControllerInstance = {};
const OrdersController = class { constructor() { return OrdersControllerInstance; } };
const EventsController = class {};
const TicketsController = class { constructor() { return TicketsControllerInstance; } };
const ApplicationsController = class { constructor() { return ApplicationsControllerInstance; } };
const utils = {};
const objection = {
  transaction: {},
  Model: class {},
};
const handlers = proxy('../../../../orders/handlers/update', {
  objection,
  '../controller': OrdersController,
  '../../events/controller': EventsController,
  '../../tickets/controller': TicketsController,
  '../../applications/controller': ApplicationsController,
  '../utils': utils,
});

describe('orders/handlers:update', () => {
  let sandbox;
  let next;
  let req;
  let res;
  before(() => {
    sandbox = sinon.sandbox.create();
    next = sandbox.stub();
  });
  beforeEach(() => {
    sandbox.reset();
    req = {
      params: {},
      body: {},
    };
    res = {
      locals: {},
      status: sandbox.stub().returns(res),
      send: sandbox.stub(),
    };
    objection.transaction.start = sandbox.stub();
    objection.Model.knex = sandbox.stub();
  });
  describe('load order', () => {
    it('should call the load function', async () => {
      req.params = {
        orderId: 'order1',
      };
      OrdersController.load = sandbox.stub().resolves({ id: 'order1' });
      await handlers[0](req, res, next);
      expect(OrdersController.load).to.have.been.calledOnce;
      expect(res.locals.order).to.eql({ id: 'order1' });
      expect(next).to.have.been.calledOnce;
    });
    it('should return 404 if there are no order found', async () => {
      req.params = {
        orderId: 'order1',
      };
      OrdersController.load = sandbox.stub().resolves(undefined);
      await handlers[0](req, res, next);
      expect(OrdersController.load).to.have.been.calledOnce;
      expect(next).to.not.have.been.called;
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(404);
    });
  });
  describe('load event', () => {
    it('should call the load function', async () => {
      res.locals = {
        order: {
          id: 'order1',
          eventId: 'event1',
        },
      };
      EventsController.load = sandbox.stub().resolves({ id: 'event1' });
      await handlers[1](req, res, next);
      expect(EventsController.load).to.have.been.calledOnce;
      expect(res.locals.event).to.eql({ id: 'event1' });
      expect(next).to.have.been.calledOnce;
    });
    it('should return 404 if there are no event found', async () => {
      res.locals = {
        order: {
          id: 'order1',
          eventId: 'event1',
        },
      };
      EventsController.load = sandbox.stub().resolves(undefined);
      await handlers[1](req, res, next);
      expect(EventsController.load).to.have.been.calledOnce;
      expect(next).to.not.have.been.called;
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(404);
    });
  });
  describe('format applications', () => {
    it('should describe the applications', async () => {
      res.locals = {
        event: { id: 'event1' },
      };
      req.body.applications = [{ name: 'application1' }];
      utils.formatApplications = sandbox.stub().returns([{ name: 'formatted1' }]);
      await handlers[2](req, res, next);
      expect(utils.formatApplications).to.have.been.calledOnce;
      expect(utils.formatApplications).to.have.been.calledWith(
        {
          id: 'event1',
        },
        [{
          name: 'application1',
        }],
      );
      expect(req.body.applications).to.eql([{ name: 'formatted1' }]);
      expect(next).to.have.been.calledOnce;
    });
  });
  describe('transaction delete & create', () => {
    it('should delete and create the new applications', async () => {
      req.body.applications = [{ ticketId: 'ticket1' }, { ticketId: 'ticket2' }];
      res.locals.event = {
        tickets: [{ id: 'ticket1' }, { id: 'ticket2' }],
      };
      const trx = {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
      };
      objection.transaction.start.resolves(trx);
      utils.quantityByTicket = sandbox.stub().returns({ ticket1: 1, ticket2: 1 });
      ApplicationsControllerInstance.delete = sandbox.stub().resolves();
      TicketsControllerInstance.load = sandbox.stub().resolves({ hasCapacityFor: sandbox.stub().throws('err') });
      OrdersControllerInstance.update = sandbox.stub().resolves();

      await handlers[3](req, res, next);
      expect(objection.transaction.start).to.have.been.calledOnce;
      expect(ApplicationsControllerInstance.delete).to.have.been.calledOnce;
      expect(utils.quantityByTicket).to.have.been.calledOnce;
      expect(TicketsControllerInstance.load).to.have.been.calledTwice;
      expect(trx.rollback).to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;

      expect(OrdersControllerInstance.update).to.not.have.been.called;
      expect(trx.commit).to.not.have.been.called;
    });
    it('should return an error if there are no tickets possibles', async () => {
      req.body.applications = [{ ticketId: 'ticket1' }, { ticketId: 'ticket2' }];
      res.locals.event = {
        tickets: [{ id: 'ticket1' }, { id: 'ticket2' }],
      };
      const trx = {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
      };
      objection.transaction.start.resolves(trx);
      utils.quantityByTicket = sandbox.stub().returns({ ticket1: 1, ticket2: 1 });
      ApplicationsControllerInstance.delete = sandbox.stub().resolves();
      TicketsControllerInstance.load = sandbox.stub().resolves({
        hasCapacityFor: sandbox.stub().returns(true),
      });
      OrdersControllerInstance.update = sandbox.stub().resolves();

      await handlers[3](req, res, next);
      expect(objection.transaction.start).to.have.been.calledOnce;
      expect(ApplicationsControllerInstance.delete).to.have.been.calledOnce;
      expect(utils.quantityByTicket).to.have.been.calledOnce;
      expect(TicketsControllerInstance.load).to.have.been.calledTwice;
      expect(OrdersControllerInstance.update).to.have.been.calledOnce;
      expect(trx.commit).to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;
    });
  });
});
