const EventsController = require('../controller');
const Model = require('../models/EventOccurrencesModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res) => {
    res.send(await EventsController.list(
      req.query,
      res.locals.qb,
    ));
  },
];
