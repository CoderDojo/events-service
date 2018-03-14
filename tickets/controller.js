const TicketModel = require('./models/TicketModel');

class TicketsController {
  static async list(query, builder = TicketModel.query()) {
    return builder
      .where(query);
  }
}

module.exports = TicketsController;
