const { Model, QueryBuilder } = require('objection');

class EventOccurrencesModel extends Model {
  static get tableName() {
    return 'v_event_occurrences';
  }

  static get QueryBuilder() {
    return class extends QueryBuilder {
      where(query) {
        if (query.after_date) {
          super.where('start_time', '>=', query.after_date);
          delete query.after_date;
        }
        if (query.before_date) {
          super.where('start_time', '<=', query.before_date);
          delete query.before_date;
        }
        return super.where(query);
      }
    };
  }
}

module.exports = EventOccurrencesModel;
