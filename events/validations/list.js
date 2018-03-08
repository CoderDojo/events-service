const { query, checkSchema } = require('express-validator/check');
const moment = require('moment');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'query[dojoId]': {
      in: ['query'],
      isUUID: true,
    },
    page: {
      in: ['query'],
      isInt: true,
      toInt: true,
      optional: true,
    },
    pageSize: {
      in: ['query'],
      isInt: true,
      toInt: true,
      optional: true,
    },
    'query[afterDate]': {
      in: ['query'],
      isISO8601: true,
      customSanitizer: {
        options(value, { req }) {
          const utcOffset = req.query.utcOffset;
          return moment.utc(value*1000).add(utcOffset, 'm').toISOString();
        },
      },
      optional: true,
    },
    'query[beforeDate]': {
      in: ['query'],
      isISO8601: true,
      customSanitizer: {
        options(value, { req }) {
          const utcOffset = req.query.utcOffset;
          return moment.utc(value*1000).add(utcOffset, 'm').toISOString();
        },
      },
      optional: true,
    },
    'utcOffset': {
      in: ['query'],
      toInt: true,
      custom: {
        options(value, { req }) {
          return !(req.query.query.beforeDate || req.query.query.afterDate) || !!value;
        },
        errorMessage: 'utcOffset is required when after_date or before_date are specified',
      },
    },
  }),
  ValidationHelper.handleErrors,
];