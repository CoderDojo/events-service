const Model = require('../models/TicketModel');

module.exports = (_baseline) => {
  const baseline = _baseline ? `${_baseline}.*.` : '';
  return {
    [`${baseline}name`]: {
      in: ['body'],
    },
    [`${baseline}type`]: {
      in: ['body'],
      // TODO: this syntax needs fixing
      custom: {
        options: (value) => {
          return Object.values(Model.TYPES).indexOf(value) > -1;
        },
      },
    },
    [`${baseline}quantity`]: {
      in: ['body'],
      isInt: true,
    },
  };
};
