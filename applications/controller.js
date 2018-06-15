const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  static async list({ query }, builder = ApplicationModel.query()) {
    return builder
      .where(query);
  }
  static async delete({ query }, builder = ApplicationModel.query()) {
    return builder
      .update({ deleted: true })
      .where(query);
  }
}

module.exports = ApplicationsController;
