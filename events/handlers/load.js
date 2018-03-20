const EventsController = require('../controller');
const Model = require('../models/EventOccurrencesModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  async (req, res) => {
    req.query.query.id = req.params.eventId;
    res.send(await EventsController.load(
      req.query,
      res.locals.qb,
    ));
  },
];
