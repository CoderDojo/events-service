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
      .applyFilter('publicFields')
      .applyFilter(filters)
      .eager(related)
      .findOne(query);
  }
  static async create(ticket) {
    return TicketModel.query().insert(ticket).returning('*');
  }
  static async update(ticket) {
    return TicketModel.query().patchAndFetchById(ticket.id, ticket).returning('*');
  }
  async load({ query, related, filters }) {
    return this.constructor.load({ query, related, filters }, this.builder);
  }
}

module.exports = TicketsController;
