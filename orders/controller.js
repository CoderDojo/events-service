const OrderModel = require('./models/OrderModel');

class OrdersController {
  constructor(trx) {
    this.builder = OrderModel.query(trx);
  }
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
  static async create({ eventId, userId, applications }, event, builder = OrderModel.query()) {
    return builder
      .context({ event })
      .insertGraph({
        eventId,
        userId,
        applications,
      })
      .returning('*');
  }
  static async update(orderId, event, { applications }, builder = OrderModel.query()) {
    return builder
      .context({ event })
      .upsertGraph({
        id: orderId,
        applications,
      }, {
        noDelete: ['applications'],
        noUnrelate: ['applications'],
      });
  }
  async update(orderId, event, { applications }) {
    return this.constructor.update(orderId, event, { applications }, this.builder);
  }
}

module.exports = OrdersController;
