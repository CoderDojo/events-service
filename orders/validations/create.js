const { body } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');
const applicationsValidator = require('../../applications/validations/create');

module.exports = [
  body('userId', 'Invalid format').isUUID(),
  body('applications', 'Must have at least one application for an order').isLength({ min: 1 }),
  ...applicationsValidator.checkApplications('applications.*.'),
  body('eventId', 'Invalid format').isUUID(),
  ValidationHelper.handleErrors,
];
