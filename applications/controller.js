const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  static async list(query, builder = ApplicationModel.query()) {
    return builder
      .where(query);
  }
}

module.exports = ApplicationsController;
