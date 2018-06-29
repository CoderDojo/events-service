const TicketModel = require('./models/TicketModel');

class TicketsController {
  constructor(trx) {
    this.builder = TicketModel.query(trx);
  }
  static async list({ query }, builder = TicketModel.query()) {
    return builder
      .where(query);
  }
  static async load({ query, related, filters }, builder = TicketModel.query()) {
    return builder
      .applyFilter(filters)
      .eager(related)
      .findOne(query);
  }
  async load({ query, related, filters }) {
    return this.constructor.load({ query, related, filters }, this.builder);
  }
}

module.exports = TicketsController;
