const { Model, QueryBuilder } = require('objection');
const Session = require('../../sessions/models/SessionModel');

class EventOccurrencesModel extends Model {
  static get tableName() {
    return 'v_event_occurrences';
  }

  static get QueryBuilder() {
    return class extends QueryBuilder {
      where(query) {
        if (query.afterDate) {
          super.where('endTime', '>=', query.afterDate);
          super.orderBy('endTime');
          delete query.afterDate;
        }
        if (query.beforeDate) {
          super.where('startTime', '<=', query.beforeDate);
          super.orderBy('startTime');
          delete query.beforeDate;
        }
        delete query.utcOffset;
        return super.where(query);
      }
    };
  }
  static get relationMappings() {
    return {
      sessions: {
        relation: Model.HasManyRelation,
        modelClass: Session,
        join: {
          from: 'cd_sessions.eventId',
          to: 'v_event_occurrences.id',
        },
      },
    };
  }
}

module.exports = EventOccurrencesModel;
