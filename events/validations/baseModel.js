const Model = require('../models/EventModel');

module.exports = {
  name: {
    in: ['body'],
  },
  dojoId: {
    in: ['body'],
    isUUID: true,
  },
  type: {
    in: ['body'],
    custom: {
      options: (value) => {
        return Object.values(Model.types).indexOf(value) > -1;
      },
    },
  },
  description: {
    in: ['body'],
    optional: true,
  },
  public: {
    in: ['body'],
    isBoolean: true,
  },
  status: {
    in: ['body'],
    custom: {
      options: (value) => {
        return Object.values(Model.statuses).indexOf(value) > -1;
      },
    },
  },
  recurringType: {
    in: ['body'],
    custom: {
      options: (value) => {
        // TODO: ensure that undefined when recurring ONLY
        return value === undefined || Object.values(Model.recurringTypes).indexOf(value) > -1;
      },
    },
  },
  dates: {
    in: ['body'],
    isArray: true,
  },
  ticketApproval: {
    in: ['body'],
    isBoolean: true,
  },
  notifyOnApplicant: {
    in: ['body'],
    isBoolean: true,
  },
  useDojoAddress: {
    in: ['body'],
    isBoolean: true,
  },
  country: {
    in: ['body'],
    isJSON: true,
  },
  city: {
    in: ['body'],
    isJSON: true,
  },
  address: {
    in: ['body'],
  },
  position: {
    in: ['body'],
    isJSON: true,
  },
};
