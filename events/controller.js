const { raw } = require('objection');
const EventOccurrencesModel = require('./models/EventOccurrencesModel');


class EventsController {
  static async list(query, builder = EventOccurrencesModel.query()) {
    const nextEvents = EventOccurrencesModel.query()
      .distinct(raw('ON (id) *'))
      .orderBy('id')
      .where(query)
      .as('nextEvents');
    return builder
      .from(nextEvents)
      .orderBy('startTime');
  }
}

module.exports = EventsController;
