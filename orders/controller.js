const OrderModel = require('./models/OrderModel');

class OrdersController {
  static async load(query, builder = OrderModel.query()) {
    return builder
      .allowEager('[applications]')
      .eager('applications')
      .modifyEager('applications', _builder =>
        _builder.applyFilter('awaiting'))
      .findOne(query);
  }
  static async list({ query }, builder = OrderModel.query()) {
    return builder
      .allowEager('[applications]')
      .eager('applications')
      .modifyEager('applications', _builder =>
        _builder.applyFilter('awaiting'))
      .where(query);
  }
  static async create({ eventId, userId, applications }, event) {
    return OrderModel
      .query()
      .context({ event })
      .insertGraph({
        eventId,
        userId,
        applications,
      })
      .returning('*');
  }
  static async update(orderId, event, { applications }) {
    return OrderModel
      .query()
      .context({ event })
      .upsertGraph({
        id: orderId,
        applications,
      }, {
        noDelete: ['applications'],
        noUnrelate: ['applications'],
      });
  }
}

module.exports = OrdersController;
