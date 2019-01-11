const ApplicationsController = require('../controller');
const Model = require('../models/ApplicationModel');
const modelHandler = require('../../util/builderHandler');

module.exports = [
  modelHandler(Model),
  async (req, res) => {
    const removeApplication = ApplicationsController.delete;
    if (req.body.soft) ApplicationsController.softDelete;
    const deleted = await removeApplication(res.locals.qb);
    if (deleted) {
      return res.sendStatus(200);
    }
    return res.sendStatus(404);
  },
];
