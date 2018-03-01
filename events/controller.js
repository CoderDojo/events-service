const { raw } = require('objection');
const EventOccurrencesModel = require('./models/EventOccurrencesModel');
const QueryHelper = require('../util/QueryHelper');


class EventsController {
  static async list(query) {
    const queryHelper = new QueryHelper(EventOccurrencesModel, query);
    const qb = queryHelper.qb;
    qb.distinct(raw('ON (start_time) *'));

    if (query.after_date) {
      qb.where('start_time', '>=', query.after_date);
      delete query.after_date;
      qb.andWhere(query);
    } else {
      qb.where(query);
    }
    qb.orderBy('start_time');
    return await qb;
  }
}

module.exports = EventsController;