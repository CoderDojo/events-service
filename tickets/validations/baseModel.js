const Model = require('../models/TicketModel');

module.exports = (_baseline) => {
  const baseline = _baseline ? `${_baseline}.*.` : '';
  return {
    [`${baseline}name`]: {
      in: ['body'],
    },
    [`${baseline}type`]: {
      in: ['body'],
      options: {
        custom(value) {
          return Model.TYPES.indexOf(value) > -1;
        },
      },
    },
    [`${baseline}quantity`]: {
      in: ['body'],
      isInteger: true,
    },
  };
};
