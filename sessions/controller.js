const SessionModel = require('./models/SessionModel');

class SessionsController {
  static async list(query, builder = SessionModel.query()) {
    return builder
      .where(query);
  }
}

module.exports = SessionsController;
