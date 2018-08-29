const { Model } = require('objection');
const { notEnoughCapacityError } = require('../errors');
const ApplicationModel = require('../../applications/models/ApplicationModel');

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
      totalApplications: builder => builder.select(this.relatedQuery('applications')
        .applyFilter('awaiting')
        .count().as('totalApplications')),
      approvedApplications: builder => builder.select(this.relatedQuery('applications')
        .applyFilter('booked')
        .count().as('approvedApplications')),
    };
  }
  static get tableName() {
    return 'cd_tickets';
  }
  static get relationMappings() {
    return {
      applications: {
        relation: Model.HasManyRelation,
        modelClass: ApplicationModel,
        join: {
          from: 'cd_tickets.id',
          to: 'cd_applications.ticketId',
        },
      },
    };
  }

  hasCapacityFor(qty) {
    // We're getting rid of parent tickets in the future, and there should be enough parent tickets
    // to cover all ninjas going anyway, so we're just going to let parent tickets be overbooked
    if (this.type === TicketModel.TYPES.PARENT || this.totalApplications + qty <= this.quantity) {
      return true;
    }
    throw notEnoughCapacityError;
  }
}

module.exports = TicketModel;
