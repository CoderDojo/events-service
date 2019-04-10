const EventsController = require('../controller');
const Model = require('../models/EventOccurrencesModel');
const collectionHandler = require('../../util/collectionHandler');
const eventFormatter = require('../formatter');

module.exports = [
  collectionHandler(Model),
  async (req, res, next) => {
    res.locals.result = await EventsController.list(
      req.query,
      res.locals.qb,
    );
    next();
  },
  eventFormatter.format,
];
