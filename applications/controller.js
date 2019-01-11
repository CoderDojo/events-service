const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  constructor(trx) {
    this.builder = ApplicationModel.query(trx);
  }
  static async list({ query }, builder = ApplicationModel.query()) {
    return builder
      .where(query);
  }
  // Used for handling diff in Orders
  static async delete({ query }, builder = ApplicationModel.query()) {
    return builder
      .update({ deleted: true })
      .where(query);
  }
  // Used to soft-delete an account's application
  // NOTE: no default builder = it should have its own context set beforehands
  static async softDelete(builder) {
    return builder
      .update({
        name: '',
        dob: new Date(),
        notes: '',
        deleted: true,
      });
  }
  // Used to hard-delete a duplicate account
  // NOTE: no default builder = it should have its own context set beforehands
  static async delete(builder) {
    return builder
      .delete();
  }

  async list({ query }) {
    return this.constructor.list({ query }, this.builder);
  }
  async delete({ query }) {
    return this.constructor.delete({ query }, this.builder);
  }
}

module.exports = ApplicationsController;
