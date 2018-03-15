const SessionsController = require('../controller');
const Model = require('../models/SessionModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res) => {
    res.send(await SessionsController.list(req.query, res.locals.qb));
  },
];
