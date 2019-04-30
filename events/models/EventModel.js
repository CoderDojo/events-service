const { Model } = require('objection');
const uuid = require('uuid/v4');
const Session = require('../../sessions/models/SessionModel');

class EventModel extends Model {
  static get types() {
    return {
      ONE_OFF: 'one-off',
      RECURRING: 'recurring',
    };
  }
  static get statuses() {
    return {
      DRAFT: 'saved',
      PUBLISHED: 'published',
      CANCELLED: 'cancelled',
    };
  }
  static get recurringTypes() {
    return {
      BIWEEKLY: 'biweekly',
      WEEKLY: 'weekly',
    };
  }

  static isEditable(status) {
    const statuses = EventModel.statuses;
    return [statuses.DRAFT, statuses.PUBLISHED].indexOf(status) > -1;
  }

  static get tableName() {
    return 'cd_events';
  }
  static get relationMappings() {
    return {
      sessions: {
        relation: Model.HasManyRelation,
        modelClass: Session,
        join: {
          from: 'cd_sessions.eventId',
          to: 'cd_events.id',
        },
      },
    };
  }
  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }
}

module.exports = EventModel;
