const SessionModel = require('./models/SessionModel');

class SessionsController {
  static async list({ query, related }, builder = SessionModel.query()) {
    return builder
      .allowEager('[tickets]')
      .eager(related)
      .modifyEager(qb => qb.applyFilter(SessionModel.active))
      .where(query);
  }
}

module.exports = SessionsController;
