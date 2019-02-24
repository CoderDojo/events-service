const OrdersController = require('../controller');
const ApplicationController = require('../../applications/controller');
const Model = require('../models/OrderModel');
const collectionHandler = require('../../util/collectionHandler');
const { orderNotFound } = require('../errors');

module.exports = [
  collectionHandler(Model),
  async (req, res, next) => {
    res.locals.order = (await OrdersController.list({
      query: {
        id: req.params.orderId,
      },
    }))[0];
    if (!res.locals.order) return next(orderNotFound);
    next();
  },
  async (req, res) => {
    const order = res.locals.order;
    const checkedApplications = await ApplicationController.checkin({
      query: {
        orderId: order.id,
      },
    });
    res.locals.order.applications = checkedApplications || [];
    res.send(res.locals.order);
  },
];
