const { body } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');
const applicationsValidator = require('../../applications/validations/create');

module.exports = [
  body('userId', 'Invalid format').isUUID(),
  body('applications', 'Must have at least one application for an order').isLength({ min: 1 }),
  // body('applications').custom(applicationsValidator.favoriteBook('hello')),
  body('applications').custom((value, { req }) => {
    if (value.length > 0) {
      // console.log('got here');
      applicationsValidator.checkApplications('applications.*.', body);
    }
  }),
  body('eventId', 'Invalid format').isUUID(),
  ValidationHelper.handleErrors,
];
