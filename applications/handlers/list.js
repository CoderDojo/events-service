const ApplicationsController = require('../controller');
const Model = require('../models/ApplicationModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res) => {
    res.send(await ApplicationsController.list(req.query, res.locals.qb));
  },
];
