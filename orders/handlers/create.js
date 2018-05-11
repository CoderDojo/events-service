const OrdersController = require('../controller');

module.exports = [
  async (req, res) => {
    res.send(await OrdersController.create(req.body));
  },
];
