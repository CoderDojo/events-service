const { raw } = require('objection');
const EventOccurrencesModel = require('./models/EventOccurrencesModel');
const QueryHelper = require('../util/QueryHelper');


class EventsController {
  static async list(query, builder = EventOccurrencesModel.query()) {
    return builder.distinct(raw('ON (start_time) *'))
      .orderBy('start_time')
      .where(query);
  }
}

module.exports = EventsController;
