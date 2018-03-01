const { Model } = require('objection');

class EventOccurrencesModel extends Model {
  static get tableName() {
    return 'v_event_occurrences';
  }
}

module.exports = EventOccurrencesModel;