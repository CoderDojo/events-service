const { param } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  param('orderId', 'Invalid format').isUUID(),
  ValidationHelper.handleErrors,
];
