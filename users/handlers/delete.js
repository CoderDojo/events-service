const ApplicationsController = require('../../applications/controller');
const Model = require('../../applications/models/ApplicationModel');

module.exports = [
  async (req, res) => {
    const qB = Model.query().where({ userId: req.params.id });
    let removeApplication = ApplicationsController.hardDelete;
    if (req.body.soft) removeApplication = ApplicationsController.softDelete;
    const deleted = await removeApplication(qB);
    if (deleted) {
      return res.sendStatus(204);
    }
    return res.sendStatus(404);
  },
];
