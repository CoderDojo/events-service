const { Model } = require('objection');
const EventModel = require('../../events/models/EventOccurrencesModel');

class SessionModel extends Model {
  static get STATUSES() {
    return {
      ACTIVE: 'active',
      CANCELLED: 'cancelled',
    };
  }
  static get namedFilters() {
    return {
      active: builder => builder.where('status', '=', SessionModel.STATUSES.ACTIVE),
      inactive: builder => builder.where('status', '=', SessionModel.STATUSES.INACTIVE),
    };
  }
  static get tableName() {
    return 'cd_sessions';
  }
  static get relationMapping() {
    return {
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: EventModel,
        join: {
          from: 'cd_session.event_id',
          to: 'v_event_occurrences.id',
        },
      },
    };
  }
}

module.exports = SessionModel;
