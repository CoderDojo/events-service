const ApplicationsController = require('../controller');
const Model = require('../models/ApplicationModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  collectionHandler(Model),
  async (req, res) => {
    const applications = await ApplicationsController.list(req.query, res.locals.qb);
    return res.send(applications);
  },
];
