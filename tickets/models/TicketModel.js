const { Model } = require('objection');

class TicketModel extends Model {
  static get TYPES() {
    return {
      NINJA: 'ninja',
      MENTOR: 'mentor',
      PARENT: 'parent-guardian',
    };
  }
  static get namedFilters() {
    return {
      active: builder => builder.where('deleted', '=', 0),
      inactive: builder => builder.where('deleted', '=', 1),
      publicFields: builder => builder.select('id', 'sessionId', 'name', 'type', 'quantity', 'deleted'),
    };
  }
  static get tableName() {
    return 'cd_tickets';
  }
}

module.exports = TicketModel;
