const ApplicationModel = require('./models/ApplicationModel');

class ApplicationsController {
  static async list({ query }, builder = ApplicationModel.query()) {
    return builder
      .where(query);
  }
  static async checkin(application) {
    application.attendance.push(new Date());
    return ApplicationModel
      .patch({ attendance: application.attendance })
      .where({ id: application.id });
  }
}

module.exports = ApplicationsController;
