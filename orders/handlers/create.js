const OrdersController = require('../controller');
const utils = require('../utils');
const EventsController = require('../../events/controller');
const TicketsController = require('../../tickets/controller');

module.exports = [
  async (req, res, next) => {
=======
const utils = require('../utils');

module.exports = [
  async (req, res, next) => {
    // Possible optimisation : load only the related tickets rather than all of the event's tickets
    res.locals.event = await EventsController.load({ query: { id: req.body.eventId }, related: 'sessions.tickets' });
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
  async (req, res, next) => {
    const { applications } = req.body;
    const { event } = res.locals;
    try {
      const quantitiesByTicketId = utils.quantityByTicket(applications);
      const applTicketIds = Object.keys(quantitiesByTicketId);

      const tickets = event.tickets.filter(t => applTicketIds.indexOf(t.id) > -1);
      await Promise.all(tickets.map(async (t) => {
        // We reload the tickets as totalApplications can be wrong post-deletion
        const a = await TicketsController.load({ query: { id: t.id }, filters: 'totalApplications' });
        a.hasCapacityFor(quantitiesByTicketId[t.id]);
      }));
      return next();
    } catch (e) {
      return next(e);
    }
  },
  async (req, res) => {
    res.send(await OrdersController.create(req.body, res.locals.event));
  },
];
