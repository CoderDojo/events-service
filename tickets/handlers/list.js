const TicketsController = require('../controller');
const Model = require('../models/TicketModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res) => {
    res.send(await TicketsController.list(req.query, res.locals.qb));
  },
];
