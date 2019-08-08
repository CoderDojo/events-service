const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');
const baseModel = require('./baseModel');
const sessionBaseModel = require('../../sessions/validations/baseModel');
const ticketsBaseModel = require('../../tickets/validations/baseModel');

module.exports = [
  checkSchema({
    ...baseModel,
    sessions: {
      in: ['body'],
      isArray: true,
    },
    id: {
      in: ['body'],
      isUUID: true,
      exists: true,
    },
    ...sessionBaseModel('sessions'),
    ...ticketsBaseModel('sessions.*.tickets'),
  }),
  ValidationHelper.handleErrors,
];
