const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[ticketId]': {
      in: ['query'],
      isUUID: true,
    },
    'query[status]': {
      in: ['query'],
      optional: true,
    },
    'query[deleted]': {
      in: ['query'],
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
