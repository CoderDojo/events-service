const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  constructor(trx) {
    this.builder = ApplicationModel.query(trx);
  }
  static async list({ query }, builder = ApplicationModel.query()) {
    return builder
      .where(query);
  }
  static async delete({ query }, builder = ApplicationModel.query()) {
    return builder
      .update({ deleted: true })
      .where(query);
  }
  async list({ query }) {
    return this.constructor.list({ query }, this.builder);
  }
  async delete({ query }) {
    return this.constructor.delete({ query }, this.builder);
  }
}

module.exports = ApplicationsController;
