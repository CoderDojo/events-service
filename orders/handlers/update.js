const { transaction, Model } = require('objection');
const utils = require('../utils');
const OrdersController = require('../controller');
const EventsController = require('../../events/controller');
const TicketsController = require('../../tickets/controller');
const ApplicationsController = require('../../applications/controller');

module.exports = [
  async (req, res, next) => {
    res.locals.order = await OrdersController.load({ id: req.params.orderId });
    if (!res.locals.order) {
      return res.status(404).send();
    }
    next();
  },
  async (req, res, next) => {
    res.locals.event = await EventsController.load({ query: { id: res.locals.order.eventId }, related: 'sessions.tickets' });
    if (!res.locals.event) {
      return res.status(404).send();
    }
    next();
  },
  (req, res, next) => {
    const { event } = res.locals;
    const { applications } = req.body;
    req.body.applications = utils.formatApplications(event, applications);
    next();
  },
  // Possible replacement: soft-delete plugin + upsertGraph
  // But plugin seems unfinished https://github.com/griffinpp/objection-soft-delete
  async (req, res, next) => {
    let trx;
    const { applications } = req.body;
    const { event } = res.locals;
    try {
      trx = await transaction.start(Model.knex());
      await (new ApplicationsController(trx)).delete({ query: { orderId: req.params.orderId } });
      const quantitiesByTicketId = utils.quantityByTicket(applications);
      const applTicketIds = Object.keys(quantitiesByTicketId);

      const tickets = event.tickets.filter(t => applTicketIds.indexOf(t.id) > -1);
      // We need to be in the same transaction to see the modification
      const ticketCtrl = new TicketsController(trx);
      await Promise.all(tickets.map(async (t) => {
        // We reload the tickets as totalApplications can be wrong post-deletion
        const a = await ticketCtrl.load({ query: { id: t.id }, filters: 'totalApplications' });
        return a.hasCapacityFor(quantitiesByTicketId[t.id]);
      }));
      // We don't use upsertGraphAndFetch as it doesn't apply the filters for related
      await (new OrdersController(trx)).update(req.params.orderId, event, req.body);
      await trx.commit();
      return next();
    } catch (e) {
      await trx.rollback();
      return next(e);
    }
  },
  async (req, res) => {
    res.send(await OrdersController.load({ id: req.params.orderId }));
  },
];
