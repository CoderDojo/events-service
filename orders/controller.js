const OrderModel = require('./models/OrderModel');

class OrdersController {
  static async list({ query }, builder = OrderModel.query()) {
    return builder
      .allowEager('[applications]')
      .eager('applications')
      .where(query);
  }
}

module.exports = OrdersController;
