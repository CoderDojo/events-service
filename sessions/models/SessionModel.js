const { Model } = require('objection');
const uuid = require('uuid/v4');
const TicketModel = require('../../tickets/models/TicketModel');

class SessionModel extends Model {
  static get STATUSES() {
    return {
      ACTIVE: 'active',
      CANCELLED: 'cancelled',
    };
  }
  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.id = uuid();
    this.status = SessionModel.STATUSES.ACTIVE;
  }
  static get namedFilters() {
    return {
      active: builder => builder.where('status', '=', SessionModel.STATUSES.ACTIVE),
      inactive: builder => builder.where('status', '=', SessionModel.STATUSES.CANCELLED),
    };
  }
  static get tableName() {
    return 'cd_sessions';
  }
  static get relationMappings() {
    return {
      tickets: {
        relation: Model.HasManyRelation,
        modelClass: TicketModel,
        join: {
          from: 'cd_tickets.sessionId',
          to: 'cd_sessions.id',
        },
      },
    };
  }
}

module.exports = SessionModel;
