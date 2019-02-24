const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  constructor(trx) {
    this.builder = ApplicationModel.query(trx);
  }
  static async list({ query }, builder = ApplicationModel.query()) {
    return builder
      .where(query)
      .applyFilter('awaiting');
  }
  // Used for handling diff in Orders
  static async delete({ query }, builder = ApplicationModel.query()) {
    return builder
      .update({ deleted: true })
      .where(query);
  }

  // NB : this makes use of knex Qb instead of Objections
  // query MUST be simple
  static async checkin({ query }) {
    const date = new Date();
    // TODO : overwrite for one-off event vs append for recurring
    query.deleted = false;
    return ApplicationModel
      .knexQuery()
      .update({
        // Switch status to accepted as it's been checked-in
        status: 'approved',
        attendance: ApplicationModel.knex().raw('array_append(attendance, ?)', [date.toISOString()]),
      })
      .where(query)
      .whereIn('status', [ApplicationModel.STATUSES.PENDING, ApplicationModel.STATUSES.APPROVED])
      .returning('*');
  }
  // Used to soft-delete an account's application
  // NOTE: no default builder = it should have its own context set beforehands
  static async softDelete(builder) {
    return builder
      .update({
        name: '',
        dateOfBirth: new Date(),
        notes: '',
        deleted: true,
      });
  }
  // Used to hard-delete a duplicate account
  // NOTE: no default builder = it should have its own context set beforehands
  static async hardDelete(builder) {
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
