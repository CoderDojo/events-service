const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');
const eventHelper = require('./helper');

module.exports = [
  checkSchema({
    eventId: {
      in: ['params'],
    },
    'query[afterDate]': eventHelper['query[afterDate]'],
    'query[beforeDate]': eventHelper['query[beforeDate]'],
    'query[utcOffset]': eventHelper['query[utcOffset]'],
    related: {
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
