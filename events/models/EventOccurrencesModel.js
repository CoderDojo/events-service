const { Model, QueryBuilder } = require('objection');

class EventOccurrencesModel extends Model {
  static get tableName() {
    return 'v_event_occurrences';
  }

  static get QueryBuilder() {
    return class extends QueryBuilder {
      where(query) {
        if (query.afterDate) {
          super.where('endTime', '>=', query.afterDate);
          delete query.afterDate;
        }
        if (query.beforeDate) {
          super.where('startTime', '<=', query.beforeDate);
          delete query.beforeDate;
        }
        return super.where(query);
      }
    };
  }
}

module.exports = EventOccurrencesModel;
