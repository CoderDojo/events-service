const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const EventsController = {};
const SessionsController = {};
const TicketsController = {};
const objection = {
  Model: class {},
};
const handlers = proxy('../../../../events/handlers/create', {
  objection,
  '../controller': EventsController,
  '../../sessions/controller': SessionsController,
  '../../tickets/controller': TicketsController,
});

describe('events/handlers:create', () => {
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
      send: sandbox.stub(),
    };
  });
  describe('Business validation', () => {
    it('should call next with Invalid status error when status is cancelled', async () => {
      req.body = {
        status: 'cancelled',
      };
      await handlers[0](req, res, next);
      expect(next).to.have.been.calledOnce;
      const e = next.getCall(0).args[0];
      expect(e.message).to.equal('Invalid status');
      expect(e.status).to.equal(400);
    });
    it('should call next with Status not handled error when the type is wrong', async () => {
      req.body = {
        type: 'recurring',
        status: 'saved',
      };
      await handlers[0](req, res, next);
      expect(next).to.have.been.calledOnce;
      const e = next.getCall(0).args[0];
      expect(e.message).to.equal('Recurring events are not implemented (yet)');
      expect(e.status).to.equal(501);
    });
    it('should prepare the variables for the next steps', async () => {
      req.body = {
        type: 'one-off',
        status: 'saved',
        sessions: [{
          name: 'session1',
          tickets: [{
            name: 'ticket1',
          }, {
            name: 'ticket2',
          }],
        }],
      };
      await handlers[0](req, res, next);
      expect(res.locals.sessions).to.be.an('array');
      expect(res.locals.tickets).to.be.an('array');
      expect(res.locals.event).to.be.an('object');
      expect(res.locals.event).to.not.have.keys('sessions');
      expect(res.locals.sessions[0]).to.not.have.keys('tickets');
    });
  });
  // Event creation
  it('should call the event creation handler', async () => {
    res.locals.event = { name: 'Event1' };
    EventsController.create = sandbox.stub().resolves({ id: 'e1' });
    await handlers[1](req, res, next);
    expect(next).to.have.been.calledOnce;
    expect(EventsController.create).to.have.been.calledOnce
      .and.calledWith({ name: 'Event1' });
    expect(res.locals.event).to.eql({ id: 'e1' });
  });
  // Session creation
  it('should call the session creation handler', async () => {
    res.locals.event = { id: 'e1' };
    res.locals.sessions = [{
      name: 'Session 1',
    }];
    SessionsController.create = sandbox.stub().resolves({ id: 's1' });
    await handlers[2](req, res, next);
    expect(next).to.have.been.calledOnce;
    expect(SessionsController.create).to.have.been.calledOnce
      .and.calledWith({ eventId: 'e1', name: 'Session 1' });
    expect(res.locals.session).to.eql({ id: 's1' });
  });
  it('should call the ticket creation and format the answer', async () => {
    res.locals.event = { id: 'e1' };
    res.locals.session = { id: 's1' };
    res.locals.tickets = [{ name: 'ticket 1' }, { name: 'ticket 2' }];
    TicketsController.create = sandbox.stub().onCall(0).resolves({ id: 't1' });
    TicketsController.create.onCall(1).resolves({ id: 't2' });
    await handlers[3](req, res, next);
    expect(TicketsController.create).to.have.been.calledTwice;
    expect(TicketsController.create.getCall(0).args[0]).to.eql({ sessionId: 's1', name: 'ticket 1' });
    expect(TicketsController.create.getCall(1).args[0]).to.eql({ sessionId: 's1', name: 'ticket 2' });
    expect(res.send).to.have.been.calledOnce
      .and.calledWith({
        id: 'e1',
        sessions: [{
          id: 's1',
          tickets: [{ id: 't1' }, { id: 't2' }],
        }],
      });
  });
});
