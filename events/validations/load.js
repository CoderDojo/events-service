const { checkSchema } = require('express-validator/check');
const moment = require('moment');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    related: {
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
