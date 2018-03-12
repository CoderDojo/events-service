const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[eventId]': {
      in: ['query'],
      isUUID: true,
    },
    'query[status]': {
      in: ['query'],
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
