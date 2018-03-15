const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[sessionId]': {
      in: ['query'],
      isUUID: true,
    },
    'query[type]': {
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
