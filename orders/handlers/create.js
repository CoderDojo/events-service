const OrdersController = require('../controller');
const EventsController = require('../../events/controller');

module.exports = [
  async (req, res, next) => {
    // TODO change list to load
    res.locals.event = await EventsController.list({ query: { id: req.body.eventId } });
    if (!res.locals.event.length) {
      return res.status(404).send();
    }
    next();
  },
  async (req, res) => {
    res.send(await OrdersController.create(req.body, res.locals.event[0]));
  },
];
