const OrdersController = require('../controller');
const ApplicationController = require('../../applications/controller');
const Model = require('../models/OrderModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res, next) => {
    res.locals.order = (await OrdersController.list({
      query: {
        id: req.params.orderId,
      },
      related: 'applications',
    }))[0];
    next();
  },
  async (req, res) => {
    const applications = res.locals.order.applications;
    const checkedApplications = await Promise.all(applications.map(appli => ApplicationController.checkin(appli)));
    res.locals.order.applications = checkedApplications;
    res.send(res.locals.order);
  },
];
