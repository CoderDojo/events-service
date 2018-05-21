const ApplicationsController = require('../controller');
const Model = require('../models/ApplicationModel');
const collectionHandler = require('../../util/collectionHandler');

module.exports = [
  async (req, res, next) => {
    res.locals.applications = await ApplicationsController.list(req.query, res.locals.qb));
    next();
  },
  async (req, res) => {
    const applications = Promise.all(res.locals.applications.map((application) => ApplicationsController.checkin(application));)
    res.send(applications);
  },
];
