const OrdersController = require('../controller');
const Model = require('../models/OrderModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res) => {
    res.send(await OrdersController.create(req.body));
  },
];
