const { checkSchema, validationResult } = require('express-validator/check');

class ValidationHelper {
  static handleErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    return next();
  }

  static checkPaginationSchema() {
    return checkSchema({
      page: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      pageSize: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
    });
  }
}

module.exports = ValidationHelper;
