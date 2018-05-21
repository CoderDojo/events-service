const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[orderId]': {
      in: ['query'],
      isUUID: true,
    },
    'query[eventId]': {
      in: ['query'],
      optional: true,
    },
    'query[applicationId]': {
      in: ['query'],
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
