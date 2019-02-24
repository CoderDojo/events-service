const { checkSchema } = require('express-validator/check');
const eventHelper = require('./helper');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[dojoId]': {
      in: ['query'],
      isUUID: true,
    },
    'query[afterDate]': eventHelper['query[afterDate]'],
    'query[beforeDate]': eventHelper['query[beforeDate]'],
    'query[utcOffset]': eventHelper['query[utcOffset]'],
    related: {
      optional: true,
    },
  }),
  ValidationHelper.checkPaginationSchema(),
  ValidationHelper.handleErrors,
];
