const { validationResult } = require('express-validator/check');

class ValidationHelper {
  static handleErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    return next();
  }
}

module.exports = ValidationHelper;