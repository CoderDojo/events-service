const OrdersController = require('../controller');
const EventsController = require('../../events/controller');
const Model = require('../models/OrderModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res, next) => {
    const event = await EventsController.list({ query: { id: req.query.query.eventId } });
    if (!event.length) {
      return res.status(404).send();
    }
    next();
  },
  async (req, res) => {
    res.send(await OrdersController.list(req.query, res.locals.qb));
  },
];
