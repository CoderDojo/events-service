const { raw } = require('objection');
const EventOccurrencesModel = require('./models/EventOccurrencesModel');


class EventsController {
  static async list({ query, related }, builder = EventOccurrencesModel.query()) {
    const nextEvents = EventOccurrencesModel.query()
      .distinct(raw('ON (id) *'))
      .allowEager('[sessions]')
      .eager(related)
      .modifyEager('sessions', _builder => _builder.applyFilter('active'))
      .orderBy('id')
      .where(query)
      .as('nextEvents');
    return builder
      .from(nextEvents)
      .orderBy('startTime');
  }
}

module.exports = EventsController;
