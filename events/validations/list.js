const { query } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  query('dojo_id', 'dojo_id must be a UUID').isUUID(),
  ValidationHelper.handleErrors,
];