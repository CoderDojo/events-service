const { raw } = require('objection');
const EventOccurrencesModel = require('./models/EventOccurrencesModel');
const EventModel = require('./models/EventModel');


class EventsController {
  static async list({ query, related }, builder = EventOccurrencesModel.query()) {
    const nextEvents = EventOccurrencesModel.query()
      .distinct(raw('ON (id) *'))
      .orderBy('id')
      .where(query)
      .as('nextEvents');
    return builder
      .from(nextEvents)
      .allowEager('sessions.tickets') // http://vincit.github.io/objection.js/#alloweager : sessions and sessions.tickets are 2 valable options
      .eager(related)
      .modifyEager('[sessions.tickets, sessions]', _builder => _builder.applyFilter('active'))
      .modifyEager('sessions.tickets', _builder =>
        _builder.applyFilter('publicFields')
          .applyFilter('totalApplications')
          .applyFilter('approvedApplications'))
      .orderBy('startTime');
  }
  static async load({ query, related }, builder = EventOccurrencesModel.query()) {
    const nextEvents = EventOccurrencesModel.query()
      .distinct(raw('ON (id) *'))
      .orderBy('id')
      .where(query)
      .as('nextEvents');
    return builder
      .from(nextEvents)
      .findOne(query)
      .allowEager('sessions.tickets') // Lazy's man solution: avoid applications here as it contains private data
      .eager(related)
      .modifyEager('[sessions.tickets, sessions]', _builder => _builder.applyFilter('active'))
      .modifyEager('sessions.tickets', _builder =>
        _builder.applyFilter('publicFields')
          .applyFilter('approvedApplications'));
  }
  static async create(event) {
    return EventModel.query().insert(event).returning('*');
  }
  static async update(event) {
    return EventModel.query().patchAndFetchById(event.id, event).returning('*');
  }
}

module.exports = EventsController;
