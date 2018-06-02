const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  static async list({ query }, builder = ApplicationModel.query()) {
    return builder
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
}

module.exports = ApplicationsController;
