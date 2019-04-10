const EventsController = require('../controller');
const builderHandler = require('../../util/builderHandler');
const Model = require('../models/EventOccurrencesModel');
const eventFormatter = require('../formatter');

module.exports = [
  builderHandler(Model),
  async (req, res, next) => {
    const query = { ...req.query, query: { ...req.query.query, id: req.params.eventId } };
    res.locals.result = await EventsController.load(
      query,
      res.locals.qb,
    );
    next();
  },
  eventFormatter.format,
];
