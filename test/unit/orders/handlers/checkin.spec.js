const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const OrdersControllerInstance = {};
const TicketsControllerInstance = {};
const ApplicationsControllerInstance = {};
const OrdersController = class { constructor() { return OrdersControllerInstance; } };
const EventsController = class {};
const TicketsController = class { constructor() { return TicketsControllerInstance; } };
const ApplicationsController = class { constructor() { return ApplicationsControllerInstance; } };

const handlers = proxy('../../../../orders/handlers/checkin', {
  '../controller': OrdersController,
  '../../events/controller': EventsController,
  '../../tickets/controller': TicketsController,
  '../../applications/controller': ApplicationsController,
});

describe('orders/handlers:checkin', () => {
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
  });
  describe('load order', () => {
    it('should call the load function', async () => {
      req.params = {
        orderId: 'order1',
      };
      OrdersController.load = sandbox.stub().resolves({ id: 'order1' });
      await handlers[1](req, res, next);
      expect(OrdersController.load).to.have.been.calledOnce;
      expect(res.locals.order).to.eql({ id: 'order1' });
      expect(next).to.have.been.calledOnce;
    });
    it('should return 404 if there are no order found', async () => {
      req.params = {
        orderId: 'order1',
      };
      OrdersController.load = sandbox.stub().resolves(undefined);
      await handlers[1](req, res, next);
      expect(OrdersController.load).to.have.been.calledOnce;
      expect(next).to.have.been.called.and.calledWith();
    });
  });
  describe('checkin the applications', () => {
    it('should call the checkin', async () => {
      res.locals.order = { id: 'order1' };
      ApplicationsController.checkin = sandbox.stub().resolves([{}, {}]);
      await handlers[2](req, res, next);
      expect(ApplicationsController.checkin).to.have.been.calledOnce
        .and.calledWith({ query: { orderId: 'order1' } });
      expect(res.send).to.have.been.calledOnce
        .and.calledWith({ id: 'order1', applications: [{}, {}] });
    });
  });
});
