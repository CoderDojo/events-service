const ApplicationsController = require('../controller');
const Model = require('../models/ApplicationModel');
const modelHandler = require('../../util/builderHandler');

module.exports = [
  modelHandler(Model),
  async (req, res) => {
    let removeApplication = ApplicationsController.hardDelete;
    if (req.body.soft) removeApplication = ApplicationsController.softDelete;
    const deleted = await removeApplication(res.locals.qb);
    if (deleted) {
      return res.sendStatus(204);
    }
    return res.sendStatus(404);
  },
];
