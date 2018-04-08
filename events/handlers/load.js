const EventsController = require('../controller');
const builderHandler = require('../../util/builderHandler');
const Model = require('../models/EventOccurrencesModel');

module.exports = [
  builderHandler(Model),
  async (req, res) => {
    const query = { ...req.query, query: { ...req.query.query, id: req.params.eventId } };
    res.send(await EventsController.load(
      query,
      res.locals.qb,
    ));
  },
];
