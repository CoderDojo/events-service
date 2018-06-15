const OrdersController = require('../controller');
const EventsController = require('../../events/controller');
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
    // TODO change list to load
    res.locals.event = await EventsController.list({ query: { id: res.locals.order.eventId } });
    if (!res.locals.event.length) {
      return res.status(404).send();
    }
    next();
  },
  // Possible replacement: soft-delete plugin + upsertGraph
  // But plugin seems unfinished https://github.com/griffinpp/objection-soft-delete
  async (req, res, next) => {
    await ApplicationsController.delete({ query: { orderId: req.params.orderId } });
    next();
  },
  async (req, res, next) => {
    await OrdersController.update(req.params.orderId, res.locals.event[0], req.body);
    next();
  },
  // We don't use upsertGraphAndFetch as it doesn't apply the filters for related
  async (req, res) => {
    res.send(await OrdersController.load({ id: req.params.orderId }));
  },
];
