const { oneOf, checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

const common = {
  'query[status]': {
    in: ['query'],
    optional: true,
  },
  'query[deleted]': {
    in: ['query'],
    optional: true,
  },
};
module.exports = [
  oneOf([
    checkSchema({
      ...common,
      'query[ticketId]': {
        in: ['query'],
        isUUID: true,
      },
    }),
    checkSchema({
      ...common,
      'query[userId]': {
        in: ['query'],
        isUUID: true,
      },
    }),
  ]),
  ValidationHelper.handleErrors,
];
