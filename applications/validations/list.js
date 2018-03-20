const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[eventId]': {
      in: ['query'],
      isUUID: true,
    },
    'query[sessionId]': {
      in: ['query'],
      optional: true,
      isUUID: true,
    },
    'query[ticketId]': {
      in: ['query'],
      optional: true,
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
    'query[name]': {
      in: ['query'],
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
